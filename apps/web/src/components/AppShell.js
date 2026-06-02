import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Sidebar } from "./Sidebar";
export function AppShell({ children }) {
    return (_jsxs("div", { className: "min-h-screen bg-void", children: [_jsx(Sidebar, {}), _jsx("main", { className: "\r\n          min-h-screen overflow-y-auto md:ml-60 pt-15 md:pt-0\r\n        ", children: _jsx("div", { className: "max-w-300 mx-auto px-5 py-6 md:px-8 md:py-8", children: children }) })] }));
}
