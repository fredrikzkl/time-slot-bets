
// Game id string as paramter
export default function GameLink() {

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
    }

    return (
        <div className="join">
            <button onClick={() => copyToClipboard()} className="btn btn-outline btn-secondary wide">
                Copy game link
            </button>
        </div>
    )
}