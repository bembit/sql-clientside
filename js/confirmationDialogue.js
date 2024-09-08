export class ConfirmationDialog {
    constructor(dialogId, confirmButtonId, cancelButtonId, closeButtonSelector) {
        this.confirmationDialog = document.getElementById(dialogId);
        this.confirmDeleteButton = document.getElementById(confirmButtonId);
        this.cancelDeleteButton = document.getElementById(cancelButtonId);
        this.closeDialogButton = document.querySelector(closeButtonSelector);
        this.currentDeleteId = null;
        this.onConfirm = null;

        this.initEventListeners();
    }

    initEventListeners() {
        this.confirmDeleteButton.addEventListener('click', () => {
            console.log('Confirm Delete Button Clicked');
            if (this.onConfirm) {
                console.log('Executing onConfirm function...');
                this.onConfirm(this.currentDeleteId);
            } else {
                console.log('onConfirm is not set.');
            }
            this.closeConfirmationDialog();
        });

        this.cancelDeleteButton.addEventListener('click', () => {
            this.closeConfirmationDialog();
        });

        window.addEventListener('click', (event) => {
            if (event.target === this.confirmationDialog) {
                this.closeConfirmationDialog();
            }
        });

        this.closeDialogButton.addEventListener('click', () => {
            this.closeConfirmationDialog();
        });
    }

    showConfirmationDialog(message, id = null, onConfirm) {
        document.getElementById('confirmation-message').textContent = message;
        this.confirmationDialog.style.display = 'block';
        this.currentDeleteId = id;
        this.onConfirm = onConfirm;
        console.log('Confirmation dialog shown with message:', message);
    }

    closeConfirmationDialog() {
        this.confirmationDialog.style.display = 'none';
        this.currentDeleteId = null;
        this.onConfirm = null;
        console.log('Confirmation dialog closed');
    }
}
