import { AppProvider } from "./providers"

export function App() {
    return (
        <AppProvider>
            <EntryPoint />
        </AppProvider>
    )
}

function EntryPoint() {
    return <h1 className="text-3xl font-bold text-blue-500 underline">Hello world!</h1>
}
