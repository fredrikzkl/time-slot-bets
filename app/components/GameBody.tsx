import { formatDate } from "../hooks/useFormatDate";

type props = {
    name: string;
    createdAt: string;
    isHost?: boolean;
    children: React.ReactNode;
}

const GameBody = ({ name, createdAt, isHost, children }: props) => {
    return (
        <div className="container text-center">
            <div className="mt-12 mb-12">
                <h1 className="text-5xl text-center font-bold ">{name}</h1>
                <p className="mt-2">{formatDate(new Date(createdAt))}</p>
                {isHost && (
                    <div className="badge badge-secondary badge-outline mt-2">Host</div>
                )}
            </div>
            {children}
        </div>
    )
};

export default GameBody