import { collection, getDocs } from "firebase/firestore";
import { observer } from "../../../observer";
import "./Overview.css";
import Chart from "chart.js/auto";

const componentID = "overview";

export default function Overview() {
  observer(componentID, compLoaded);

  return /*html*/ `
    <div component="${componentID}" class="overview-dashboard">
      <!-- Order Statistics Card -->
      <div class="stats-card">
        <h3>Order Statistics</h3>
        <div class="row">
          <!-- Total Orders -->
          <div class="col-md-6">
            <div class="metric-card">
              <h4>Total Orders</h4>
              <div id="totalOrders">Loading...</div>
            </div>
          </div>
          <!-- Orders by Status -->
          <div class="col-md-6">
            <div class="chart-container">
              <canvas id="orderStatusChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Insights Card -->
      <div class="stats-card">
        <h3>Product Insights</h3>
        <div class="row">
          <!-- Best Selling Products -->
          <div class="col-md-6">
            <div class="chart-container">
              <canvas id="bestSellersChart"></canvas>
            </div>
          </div>
          <!-- Popular Categories -->
          <div class="col-md-6">
            <div class="chart-container">
              <canvas id="categoriesChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

const compLoaded = async () => {
  // Wait for DOM elements to be ready
  await waitForElements();

  try {
    // Fetch statistics
    const [orderStats, productInsights] = await Promise.all([
      getOrderStatistics(),
      getProductInsights(),
    ]);

    // Update total orders count
    document.getElementById("totalOrders").textContent = orderStats.total;

    // Render charts
    renderOrderStatusChart(orderStats.byStatus);
    renderBestSellersChart(productInsights.productSales);
    renderCategoriesChart(productInsights.categorySales);
  } catch (error) {
    console.error("Error loading overview data:", error);
  }
};

// Export the initialization function so it can be called directly
export const initializeOverviewData = compLoaded;

// Helper function to wait for DOM elements to be ready
function waitForElements() {
  return new Promise((resolve) => {
    const checkElements = () => {
      const totalOrdersEl = document.getElementById("totalOrders");
      const orderStatusChart = document.getElementById("orderStatusChart");
      const bestSellersChart = document.getElementById("bestSellersChart");
      const categoriesChart = document.getElementById("categoriesChart");

      if (
        totalOrdersEl &&
        orderStatusChart &&
        bestSellersChart &&
        categoriesChart
      ) {
        resolve();
      } else {
        setTimeout(checkElements, 50);
      }
    };
    checkElements();
  });
}

async function getOrderStatistics() {
  const ordersCollection = collection(App.firebase.db, "orders");
  const ordersSnapshot = await getDocs(ordersCollection);

  const stats = {
    total: 0,
    byStatus: {
      processing: 0,
      shipped: 0,
      "on-the-way": 0,
      delivered: 0,
      cancelled: 0,
    },
  };

  ordersSnapshot.forEach((doc) => {
    const orderData = doc.data();
    if (orderData.orderList && Array.isArray(orderData.orderList)) {
      orderData.orderList.forEach((order) => {
        stats.total++;
        if (stats.byStatus.hasOwnProperty(order.status)) {
          stats.byStatus[order.status]++;
        }
      });
    }
  });

  return stats;
}

async function getProductInsights() {
  const ordersCollection = collection(App.firebase.db, "orders");
  const ordersSnapshot = await getDocs(ordersCollection);

  const productSales = {};
  const categorySales = {};

  ordersSnapshot.forEach((doc) => {
    const orderData = doc.data();
    if (orderData.orderList && Array.isArray(orderData.orderList)) {
      orderData.orderList.forEach((order) => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item) => {
            // Track product sales
            productSales[item.name] =
              (productSales[item.name] || 0) + item.quantity;
            // Track category sales
            if (item.category) {
              categorySales[item.category] =
                (categorySales[item.category] || 0) + item.quantity;
            }
          });
        }
      });
    }
  });

  return {
    productSales: Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5), // Top 5 products
    categorySales: Object.entries(categorySales),
  };
}

function renderOrderStatusChart(statusData) {
  const ctx = document.getElementById("orderStatusChart");
  if (!ctx) return;

  // Destroy existing chart if it exists
  const existingChart = Chart.getChart(ctx);
  if (existingChart) {
    existingChart.destroy();
  }

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(statusData).map(
        (status) => status.charAt(0).toUpperCase() + status.slice(1)
      ),
      datasets: [
        {
          data: Object.values(statusData),
          backgroundColor: [
            "#0d6efd", // processing - blue
            "#ffc107", // shipped - yellow
            "#fd7e14", // on-the-way - orange
            "#198754", // delivered - green
            "#dc3545", // cancelled - red
          ],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Orders by Status",
        },
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

function renderBestSellersChart(productSales) {
  const ctx = document.getElementById("bestSellersChart");
  if (!ctx) return;

  // Destroy existing chart if it exists
  const existingChart = Chart.getChart(ctx);
  if (existingChart) {
    existingChart.destroy();
  }

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: productSales.map(([name]) => name),
      datasets: [
        {
          label: "Units Sold",
          data: productSales.map(([, count]) => count),
          backgroundColor: "#0d6efd",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Best Selling Products",
        },
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
    },
  });
}

function renderCategoriesChart(categorySales) {
  const ctx = document.getElementById("categoriesChart");
  if (!ctx) return;

  // Destroy existing chart if it exists
  const existingChart = Chart.getChart(ctx);
  if (existingChart) {
    existingChart.destroy();
  }

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: categorySales.map(([category]) => category),
      datasets: [
        {
          data: categorySales.map(([, count]) => count),
          backgroundColor: [
            "#0d6efd",
            "#6610f2",
            "#6f42c1",
            "#d63384",
            "#dc3545",
            "#fd7e14",
            "#ffc107",
            "#198754",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Sales by Category",
        },
        legend: {
          position: "bottom",
        },
      },
    },
  });
}
