import ThemeSelector from "@/components/ThemeSelector";

const Navbar = () => (
    <div className="navbar bg-primary">
        <div className="navbar-start">
            <a className="btn btn-ghost normal-case text-xl" href={"/"}>Area</a>
        </div>
        <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
                <li>
                    <a href={"/features"}>Features</a>
                </li>
                <li>
                    <a href={"/pricing"}>Pricing</a>
                </li>
                <li>
                    <a href={"/documentation"}>Documentation</a>
                </li>
                <li>
                    <a href={"/team"}>Team</a>
                </li>
            </ul>
        </div>
        <div className="navbar-end">
            <ThemeSelector/>
            <a className="btn btn-ghost mx-2">Login</a>
            <a className="btn btn-secondary mr-2">Sign up</a>
        </div>
    </div>
);

export default Navbar;