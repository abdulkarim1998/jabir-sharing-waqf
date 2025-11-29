import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrganizationRequests } from '../api';

export default function RequestsList() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await getOrganizationRequests('pending');
      setRequests(response.data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      alert('فشل جلب الطلبات');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">طلبات المنظمات المعلقة</h1>

      {requests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">لا توجد طلبات معلقة</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <div
              key={request.id}
              onClick={() => navigate(`/request/${request.id}`)}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-[#BC9B6A]"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">{request.name}</h2>
                  <div className="space-y-1 text-gray-600">
                    <p>
                      <span className="font-medium">الهاتف:</span> {request.phone}
                    </p>
                    <p>
                      <span className="font-medium">السجل التجاري:</span> {request.cr}
                    </p>
                    {request.description && (
                      <p className="line-clamp-2">
                        <span className="font-medium">الوصف:</span> {request.description}
                      </p>
                    )}
                    <p className="text-sm text-gray-400">
                      تاريخ التقديم: {new Date(request.created_date).toLocaleDateString('ar-SA')}
                    </p>
                  </div>

                  {request.documents && request.documents.length > 0 && (
                    <div className="mt-4">
                      <p className="font-medium text-gray-700">
                        📎 {request.documents.length} مستند مرفق
                      </p>
                    </div>
                  )}
                </div>

                <div className="mr-4 text-gray-400">
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

