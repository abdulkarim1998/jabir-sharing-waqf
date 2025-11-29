import { useState, useEffect } from 'react';
import { getOrganizationRequests, updateRequestStatus } from '../api';

export default function RequestsList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

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

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateRequestStatus(id, status);
      const statusText = status === 'approved' ? 'موافق عليه' : 'مرفوض';
      alert(`تم ${statusText} الطلب بنجاح!`);
      fetchRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('فشل تحديث حالة الطلب');
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
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{request.name}</h2>
                  <div className="space-y-1 text-gray-600">
                    <p>
                      <span className="font-medium">الهاتف:</span> {request.phone}
                    </p>
                    <p>
                      <span className="font-medium">السجل التجاري:</span> {request.cr}
                    </p>
                    {request.description && (
                      <p>
                        <span className="font-medium">الوصف:</span> {request.description}
                      </p>
                    )}
                    <p className="text-sm text-gray-400">
                      تاريخ التقديم: {new Date(request.created_date).toLocaleDateString('ar-SA')}
                    </p>
                  </div>

                  {request.documents && request.documents.length > 0 && (
                    <div className="mt-4">
                      <p className="font-medium mb-2">المستندات ({request.documents.length}):</p>
                      <div className="flex flex-wrap gap-2">
                        {request.documents.map((doc) => (
                          <a
                            key={doc.id}
                            href={`http://localhost:8081${doc.document_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline text-sm"
                          >
                            عرض المستند
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mr-4">
                  <button
                    onClick={() => handleStatusUpdate(request.id, 'approved')}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    موافقة
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(request.id, 'rejected')}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    رفض
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

