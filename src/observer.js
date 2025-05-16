function observer(componentID, callback) {
  new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      for (const node of mutation.addedNodes) {
        if (
          node.nodeType === 1 &&
          node.hasAttribute("component") &&
          node.getAttribute("component") === componentID
        ) {
          callback();
          observer.disconnect();
          return;
        }
      }
    }
  }).observe(document.body, { childList: true, subtree: true });
}

export { observer };
