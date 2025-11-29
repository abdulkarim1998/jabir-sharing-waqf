import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <div className="bg-[#F3F3F3] w-full">
            <div className="flex justify-between w-full max-w-screen-2xl py-4 items-center mx-auto px-8">
                <div className="flex gap-16 items-center">
                    <a href="/">
                        <img src="/logo.svg" alt="Jabir Foundation" className="h-12" />
                    </a>
                    <nav className="flex gap-4">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-[#BC9B6A] font-medium transition-colors"
                        >
                            الطلبات المعلقة
                        </Link>
                        <Link
                            to="/submit"
                            className="text-gray-700 hover:text-[#BC9B6A] font-medium transition-colors"
                        >
                            تقديم طلب
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    );
}
