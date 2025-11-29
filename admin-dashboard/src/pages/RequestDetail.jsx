import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrganizationRequest, updateRequestStatus } from '../api';

export default function RequestDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDocument, setSelectedDocument] = useState(null);

    useEffect(() => {
        fetchRequest();
    }, [id]);

    const fetchRequest = async () => {
        try {
            setLoading(true);
            const response = await getOrganizationRequest(id);
            setRequest(response.data);
        } catch (error) {
            console.error('Error fetching request:', error);
            alert('فشل جلب تفاصيل الطلب');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (status) => {
        if (!window.confirm(`هل أنت متأكد من ${status === 'approved' ? 'الموافقة على' : 'رفض'} هذا الطلب؟`)) {
            return;
        }

        try {
            await updateRequestStatus(id, status);
            const statusText = status === 'approved' ? 'موافق عليه' : 'مرفوض';
            alert(`تم ${statusText} الطلب بنجاح!`);
            navigate('/');
        } catch (error) {
            console.error('Error updating status:', error);
            alert('فشل تحديث حالة الطلب');
        }
    };

    const getFileType = (url) => {
        const extension = url.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
            return 'image';
        } else if (extension === 'pdf') {
            return 'pdf';
        }
        return 'other';
    };

    const openDocumentViewer = (doc) => {
        setSelectedDocument(doc);
    };

    const closeDocumentViewer = () => {
        setSelectedDocument(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">جاري التحميل...</div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-xl text-gray-600">الطلب غير موجود</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 text-blue-600 hover:text-blue-800"
                    >
                        العودة للقائمة
                    </button>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
        };
        const labels = {
            pending: 'معلق',
            approved: 'موافق عليه',
            rejected: 'مرفوض',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${badges[status] || badges.pending}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate('/')}
                    className="text-gray-600 hover:text-gray-800 mb-4 flex items-center gap-2"
                >
                    ← العودة للقائمة
                </button>
                <div className="flex justify-between items-start">
                    <h1 className="text-3xl font-bold text-gray-800">تفاصيل الطلب</h1>
                    {getStatusBadge(request.status)}
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
                {/* Organization Info */}
                <div className="border-b pb-6">
                    <h2 className="text-2xl font-semibold mb-4 text-[#BC9B6A]">معلومات المنظمة</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500">اسم المنظمة</label>
                            <p className="text-lg font-semibold text-gray-800">{request.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">رقم الهاتف</label>
                            <p className="text-lg text-gray-800" dir="ltr">{request.phone}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">السجل التجاري</label>
                            <p className="text-lg text-gray-800">{request.cr}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">تاريخ التقديم</label>
                            <p className="text-lg text-gray-800">
                                {new Date(request.created_date).toLocaleDateString('ar-SA', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {request.description && (
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold mb-3 text-[#BC9B6A]">الوصف</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{request.description}</p>
                    </div>
                )}

                {/* Documents */}
                {request.documents && request.documents.length > 0 && (
                    <div className="border-b pb-6">
                        <h2 className="text-xl font-semibold mb-4 text-[#BC9B6A]">
                            المستندات ({request.documents.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {request.documents.map((doc, index) => {
                                const fileType = getFileType(doc.document_url);
                                return (
                                    <div
                                        key={doc.id}
                                        className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#BC9B6A] transition-all"
                                    >
                                        <div className="text-3xl">
                                            {fileType === 'image' ? '🖼️' : fileType === 'pdf' ? '📄' : '📎'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">مستند {index + 1}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(doc.created_date).toLocaleDateString('ar-SA')}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openDocumentViewer(doc)}
                                                className="p-2 text-[#BC9B6A] hover:bg-[#BC9B6A] hover:text-white rounded-lg transition-colors"
                                                title="عرض المستند"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    />
                                                </svg>
                                            </button>
                                            <a
                                                href={`http://localhost:8081${doc.document_url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                                                title="فتح في نافذة جديدة"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                    />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Actions */}
                {request.status === 'pending' && (
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={() => handleStatusUpdate('approved')}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors"
                        >
                            موافقة على الطلب
                        </button>
                        <button
                            onClick={() => handleStatusUpdate('rejected')}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors"
                        >
                            رفض الطلب
                        </button>
                    </div>
                )}
            </div>

            {/* Document Viewer Modal */}
            {selectedDocument && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
                    onClick={closeDocumentViewer}
                >
                    <div
                        className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold">عرض المستند</h3>
                            <button
                                onClick={closeDocumentViewer}
                                className="text-gray-500 hover:text-gray-700 p-2"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4">
                            {getFileType(selectedDocument.document_url) === 'image' ? (
                                <img
                                    src={`http://localhost:8081${selectedDocument.document_url}`}
                                    alt="Document"
                                    className="w-full h-auto"
                                />
                            ) : getFileType(selectedDocument.document_url) === 'pdf' ? (
                                <iframe
                                    src={`http://localhost:8081${selectedDocument.document_url}`}
                                    className="w-full h-[80vh]"
                                    title="PDF Viewer"
                                />
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-600 mb-4">لا يمكن عرض هذا النوع من الملفات</p>
                                    <a
                                        href={`http://localhost:8081${selectedDocument.document_url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                        تحميل الملف
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
