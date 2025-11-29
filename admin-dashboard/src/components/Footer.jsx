import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <div className="bg-[#392c45] text-[#F4F4F4] text-sm pt-14 pb-7 mt-auto">
            <div className="max-w-screen-2xl mx-auto px-8">
                <div className="grid gap-10 grid-cols-1 md:grid-cols-3 border-b border-[#A7A9AC]/20 pb-7">
                    <div>
                        <h4 className="font-bold mb-3">روابط سريعة</h4>
                        <div className="flex flex-col gap-2">
                            <Link to="/" className="hover:text-[#BC9B6A] transition-colors">
                                الطلبات المعلقة
                            </Link>
                            <Link to="/submit" className="hover:text-[#BC9B6A] transition-colors">
                                تقديم طلب
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h4 className="font-bold">
                            لكي تكون شريكا في مؤسسة الإمام جابر بن زيد الوقفية يمكنك التواصل على:
                        </h4>
                        <a
                            href="tel:+968-9781-1525"
                            className="underline hover:underline-offset-2 transition-all"
                            dir="ltr"
                        >
                            +968 9781 1525
                        </a>
                        <a
                            href="mailto:info@jabirfoundation.om"
                            className="underline hover:underline-offset-2 transition-all"
                            dir="ltr"
                        >
                            info@jabirfoundation.om
                        </a>
                    </div>

                    <div className="flex justify-center md:justify-end">
                        <img
                            src="/jf-logo-white.png"
                            alt="مؤسسة الإمام جابر بن زيد الوقفية"
                            className="h-24 object-contain"
                        />
                    </div>
                </div>

                <div className="mt-7 text-center">
                    <p>جميع الحقوق محفوظة © 2023 | مؤسسة الإمام جابر بن زيد الوقفية</p>
                </div>
            </div>
        </div>
    );
}
