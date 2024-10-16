namespace('gizmo-atheneum.namespaces.react.Dialog', () => {
    const Dialog = function (dialogName, TemplateClass, onClose, attrs, addlProps) {
      attrs = attrs || {};
      const modalOpenEvent = 'modal.' + dialogName + '.open';
      const dialog = document.createElement('dialog');
      Object.entries(attrs).forEach(([k, v]) => {
        dialog.setAttribute(k, v);
      });
      ReactDOM.createRoot(dialog).render(
        <TemplateClass
          addlProps={addlProps}
          setOnOpen={(setter) => {
            document.addEventListener(modalOpenEvent, (e) => {
              setter(e.detail);
            });
          }}
          onClose={(value) => {
            if (onClose !== undefined && value !== undefined) {
              onClose(value);
            }
            dialog.close();
            if (dialog.parentElement) {
              dialog.parentElement.removeChild(dialog);
            }
          }}/>);
      this.open = function (detail) {
        document.body.appendChild(dialog);
        dialog.showModal();
        document.dispatchEvent(new CustomEvent(modalOpenEvent, { detail }));
      };
    };
    Dialog.factory = function (dialogMap) {
      return Object.entries(dialogMap).reduce((out, [dialogName, { templateClass, onClose, attrs, addlProps }]) => {
        out[dialogName] = new Dialog(dialogName, templateClass, onClose, attrs, addlProps);
        return out;
      }, {});
    };
    return Dialog;
  });