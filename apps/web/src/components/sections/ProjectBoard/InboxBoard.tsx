import InboxBoardNavbar from "./ProjectBoardComponents/InboxBoardNavbar"

export default function InboxBoard() {
    return (
        <div className="min-w-[14vw] bg-amber-200 border-neutral-900 h-245.25">
            <InboxBoardNavbar />
            <main>
                <div>
                    <p>Add new</p>
                </div>
            </main>
        </div>
    )
}