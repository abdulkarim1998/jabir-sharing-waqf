import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrganizationRequest } from '../api';

export default function SubmitRequest() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cr: '',
    description: '',
  });
  const [documents, setDocuments] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setDocuments((prev) => [...prev, ...files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) => {
      const extension = file.name.split('.').pop().toLowerCase();
      return ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'].includes(extension);
    });

    if (files.length > 0) {
      setDocuments((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png'].includes(extension)) {
      return '🖼️';
    } else if (extension === 'pdf') {
      return '📄';
    } else if (['doc', 'docx'].includes(extension)) {
      return '📝';
    }
    return '📎';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.cr) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('cr', formData.cr);
      if (formData.description) {
        data.append('description', formData.description);
      }
      
      documents.forEach((file) => {
        data.append('documents', file);
      });

      await createOrganizationRequest(data);
      alert('تم إرسال الطلب بنجاح!');
      navigate('/');
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('فشل إرسال الطلب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">تقديم طلب منظمة</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اسم المنظمة *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
            placeholder="أدخل اسم المنظمة"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رقم الهاتف *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
            placeholder="أدخل رقم الهاتف"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            السجل التجاري (CR) *
          </label>
          <input
            type="text"
            name="cr"
            value={formData.cr}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
            placeholder="أدخل رقم السجل التجاري"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الوصف
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
            placeholder="أدخل وصف المنظمة"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            المستندات (PDF، الصور، Word)
          </label>
          
          {/* Drag and Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-all duration-200 ease-in-out
              ${isDragging 
                ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="hidden"
            />
            
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="text-5xl">
                {isDragging ? '📥' : '📁'}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-700">
                  {isDragging ? 'أسقط الملفات هنا' : 'اسحب وأفلت الملفات هنا'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  أو <span className="text-blue-500 font-medium">تصفح</span> لاختيار الملفات
                </p>
              </div>
              <p className="text-xs text-gray-400">
                المدعومة: PDF، JPG، PNG، DOC، DOCX (الحد الأقصى لحجم الملف: 10 ميجابايت)
              </p>
            </div>
          </div>

          {/* File List */}
          {documents.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">
                الملفات المحددة ({documents.length})
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {documents.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0">
                        {getFileIcon(file.name)}
                      </span>
                      <div className="flex-1 min-w-0 text-right">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                      title="إزالة الملف"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}

