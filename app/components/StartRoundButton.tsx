
const modalName = "start-game-modal";

export default function StartRoundButton() {

    const handleClick = () => {
        var modal = document.getElementById(modalName) as HTMLDialogElement;
        if (modal)
            modal.showModal();
    }

    return (
        <>
            <button onClick={handleClick} className="btn btn-primary">Start Round</button>
            <dialog id={modalName} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Start round?</h3>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-primary">Let's go</button>
                            <button className="btn btn-neutral ml-6">Close</button>
                        </form>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>

            </dialog >
        </>
    )
}