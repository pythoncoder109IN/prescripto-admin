import { useRef, useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { 
  Image, 
  UploadCloud, 
  FileText, 
  Save, 
  Eye, 
  Sparkles,
  Type,
  AlignLeft,
  Send,
  X,
  Calendar,
  User,
  Clock,
  ArrowLeft
} from "lucide-react";
import { DoctorContext } from "../../context/doctorContext";
import toast from "react-hot-toast";
import { AppContext } from "../../context/appContext";
import axios from "axios";

const BlogEditor = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [editorContent, setEditorContent] = useState("");
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const { backendUrl, dToken, isLoading, setIsLoading, profileData } = useContext(DoctorContext);
  const { Loader } = useContext(AppContext);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      toast.error("Unsupported file type. Please upload an image.", {
        style: {
          borderRadius: "12px",
          background: "#ef4444",
          color: "#fff",
        },
      });
      setFile(null);
    }
  };

  useEffect(() => {
  if (!showPreview) {
    // Always create a new Quill instance when editor is mounted
    if (editorRef.current) {
      // Clear any previous instance
      if (quillRef.current) {
        quillRef.current = null;
      }

      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["link"],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["clean"],
          ],
        },
        placeholder: "Write your blog content here...",
      });

      quillRef.current.root.innerHTML = editorContent;

      quillRef.current.on("text-change", () => {
        const html = editorRef.current.querySelector(".ql-editor").innerHTML;
        setEditorContent(html);
      });
    }
  }
}, [showPreview]);


  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      if (!title.trim()) {
        toast.error("Please enter a blog title", {
          style: {
            borderRadius: "12px",
            background: "#ef4444",
            color: "#fff",
          },
        });
        return;
      }

      if (!summary.trim()) {
        toast.error("Please enter a blog summary", {
          style: {
            borderRadius: "12px",
            background: "#ef4444",
            color: "#fff",
          },
        });
        return;
      }

      if (!editorContent.trim()) {
        toast.error("Please write some blog content", {
          style: {
            borderRadius: "12px",
            background: "#ef4444",
            color: "#fff",
          },
        });
        return;
      }

      const formData = new FormData();
      formData.append("docId", "");
      if (file) formData.append("image", file);
      formData.append("title", title);
      formData.append("summary", summary);
      formData.append("content", editorContent);

      const { data } = await axios.post(
        backendUrl + "/api/doctor/add-blog",
        formData,
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success("Blog published successfully! 🎉", {
          style: {
            borderRadius: "12px",
            background: "#10b981",
            color: "#fff",
          },
        });
        
        // Reset form
        if (quillRef.current) {
          quillRef.current.setContents([]);
        }
        setTitle("");
        setSummary("");
        setEditorContent("");
        setFile(null);
        setPreview(null);
        setShowPreview(false);
      } else {
        toast.error(data.message, {
          style: {
            borderRadius: "12px",
            background: "#ef4444",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        style: {
          borderRadius: "12px",
          background: "#ef4444",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    if (!title.trim()) {
      toast.error("Please enter a blog title to preview", {
        style: {
          borderRadius: "12px",
          background: "#ef4444",
          color: "#fff",
        },
      });
      return;
    }

    if (!summary.trim()) {
      toast.error("Please enter a blog summary to preview", {
        style: {
          borderRadius: "12px",
          background: "#ef4444",
          color: "#fff",
        },
      });
      return;
    }

    if (!editorContent.trim()) {
      toast.error("Please write some content to preview", {
        style: {
          borderRadius: "12px",
          background: "#ef4444",
          color: "#fff",
        },
      });
      return;
    }

    setShowPreview(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Preview Component
  const BlogPreview = () => (
    <motion.div 
      className="max-w-4xl mx-auto space-y-6 sm:space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Preview Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8"
        variants={itemVariants}
      >
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => setShowPreview(false)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={16} />
            Back to Editor
          </motion.button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Blog Preview</h1>
            <p className="text-gray-600 text-sm">How your blog will appear to readers</p>
          </div>
        </div>

        <motion.button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <Loader color="#ffffff" />
          ) : (
            <>
              <Send size={16} />
              Publish Now
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Blog Preview Content */}
      <motion.article 
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
        variants={itemVariants}
      >
        {/* Cover Image */}
        {preview && (
          <motion.div 
            className="relative h-48 sm:h-64 lg:h-80 overflow-hidden"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={preview}
              alt="Blog cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </motion.div>
        )}

        <div className="p-6 sm:p-8 lg:p-12">
          {/* Blog Header */}
          <motion.div 
            className="mb-6 sm:mb-8"
            variants={itemVariants}
          >
            <motion.h1 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {title}
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {summary}
            </motion.p>

            {/* Author Info */}
            <motion.div 
              className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl border border-blue-200/50"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <motion.img
                  src={profileData?.image || "https://via.placeholder.com/60"}
                  alt={profileData?.name || "Doctor"}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-white shadow-lg"
                  whileHover={{ scale: 1.1 }}
                />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                    Dr. {profileData?.name || "Doctor Name"}
                  </h3>
                  <p className="text-blue-600 font-medium text-xs sm:text-sm">
                    {profileData?.speciality || "Medical Specialist"}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>{new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>5 min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={14} />
                  <span>Medical Professional</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Blog Content */}
          <motion.div 
            className="prose prose-lg max-w-none"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div 
              className="blog-content text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: editorContent }}
              style={{
                fontSize: '1.1rem',
                lineHeight: '1.8',
              }}
            />
          </motion.div>

          {/* Blog Footer */}
          <motion.div 
            className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={profileData?.image || "https://via.placeholder.com/40"}
                  alt={profileData?.name || "Doctor"}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Written by Dr. {profileData?.name || "Doctor Name"}
                  </p>
                  <p className="text-gray-600 text-xs">
                    {profileData?.speciality || "Medical Specialist"} • {profileData?.experience || "5+ years experience"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Published on {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.article>
    </motion.div>
  );

  // Main Editor Component
  if (showPreview) {
    return <BlogPreview />;
  }

  return (
    <motion.div 
      className="max-w-6xl mx-auto space-y-6 sm:space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="mb-6 sm:mb-8"
        variants={itemVariants}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
            <FileText className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Blog Post</h1>
            <p className="text-gray-600 text-sm sm:text-base">Share your medical expertise and insights</p>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="hidden sm:block"
          >
            <Sparkles className="text-blue-500" size={24} />
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Cover Image Upload */}
          <motion.div 
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <Image className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">Cover Image</h3>
                  <p className="text-gray-600 text-sm">Upload an eye-catching cover image</p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <motion.div
                className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center transition-all duration-200 cursor-pointer ${
                  file
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                }`}
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {!file ? (
                  <div>
                    <div className="flex justify-center mb-4">
                      <UploadCloud className="text-gray-400" size={40} />
                    </div>
                    <p className="text-gray-600 mb-2 font-medium text-sm sm:text-base">Click or drag to upload cover image</p>
                    <p className="text-xs sm:text-sm text-gray-500">Supports: JPG, PNG (Max 5MB)</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-center mb-4">
                      {preview ? (
                        <motion.img
                          src={preview}
                          alt="Cover preview"
                          className="h-24 w-36 sm:h-32 sm:w-48 object-cover rounded-xl border-2 border-white shadow-lg"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        />
                      ) : (
                        <Image className="text-blue-500" size={40} />
                      )}
                    </div>
                    <p className="text-gray-700 font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Blog Content */}
          <motion.div 
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <Type className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">Blog Content</h3>
                  <p className="text-gray-600 text-sm">Write your blog post content</p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div ref={editorRef} className="min-h-[300px] sm:min-h-[400px] bg-white rounded-xl border border-gray-200"></div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          {/* Blog Details */}
          <motion.div 
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <AlignLeft className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">Blog Details</h3>
                  <p className="text-gray-600 text-sm">Basic information</p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Blog Title
                </label>
                <motion.input
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                  type="text"
                  placeholder="Enter an engaging title"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Summary
                </label>
                <motion.textarea
                  onChange={(e) => setSummary(e.target.value)}
                  value={summary}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-sm"
                  placeholder="Write a brief summary..."
                  rows={4}
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div 
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            variants={itemVariants}
          >
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <motion.button
                onClick={handlePreview}
                className="w-full flex items-center justify-center gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl sm:rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(168, 85, 247, 0.3)" }}
                whileTap={{ scale: 0.98 }}
              >
                <Eye size={18} />
                Preview Blog
              </motion.button>

              <motion.button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl sm:rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <Loader color="#ffffff" />
                ) : (
                  <>
                    <Send size={18} />
                    Publish Blog
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div 
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200"
            variants={itemVariants}
          >
            <h4 className="font-bold text-gray-900 mb-3 text-sm sm:text-base">Writing Tips</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                Use clear, engaging headlines
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                Include relevant medical insights
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                Add practical health tips
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                Keep content patient-friendly
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                Preview before publishing
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4, .blog-content h5, .blog-content h6 {
          font-weight: bold;
          margin: 1.5rem 0 1rem 0;
          color: #1f2937;
        }
        .blog-content h1 { font-size: 2rem; }
        .blog-content h2 { font-size: 1.75rem; }
        .blog-content h3 { font-size: 1.5rem; }
        .blog-content h4 { font-size: 1.25rem; }
        .blog-content h5 { font-size: 1.125rem; }
        .blog-content h6 { font-size: 1rem; }
        .blog-content p {
          margin: 1rem 0;
          line-height: 1.8;
        }
        .blog-content ul, .blog-content ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        .blog-content li {
          margin: 0.5rem 0;
        }
        .blog-content blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          background: #f8fafc;
          padding: 1rem;
          border-radius: 0.5rem;
        }
        .blog-content a {
          color: #3b82f6;
          text-decoration: underline;
        }
        .blog-content strong {
          font-weight: bold;
        }
        .blog-content em {
          font-style: italic;
        }
      `}</style>
    </motion.div>
  );
};

export default BlogEditor;