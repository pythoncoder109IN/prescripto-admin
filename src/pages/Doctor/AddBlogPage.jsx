import { useRef, useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
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
  Send
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

  const { backendUrl, dToken, isLoading, setIsLoading } = useContext(DoctorContext);
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
    if (!quillRef.current) {
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

      quillRef.current.on("text-change", (delta, oldDelta, source) => {
        const html = editorRef.current.querySelector(".ql-editor").innerHTML;
        setEditorContent(html);
      });
    }
  }, []);

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
        quillRef.current.setContents([]);
        setTitle("");
        setSummary("");
        setEditorContent("");
        setFile(null);
        setPreview(null);
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

  return (
    <motion.div 
      className="p-6 max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="mb-8"
        variants={itemVariants}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
            <FileText className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Blog Post</h1>
            <p className="text-gray-600">Share your medical expertise and insights</p>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="ml-auto"
          >
            <Sparkles className="text-blue-500" size={24} />
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cover Image Upload */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <Image className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Cover Image</h3>
                  <p className="text-gray-600">Upload an eye-catching cover image</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <motion.div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer ${
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
                      <UploadCloud className="text-gray-400" size={48} />
                    </div>
                    <p className="text-gray-600 mb-2 font-medium">Click or drag to upload cover image</p>
                    <p className="text-sm text-gray-500">Supports: JPG, PNG (Max 5MB)</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-center mb-4">
                      {preview ? (
                        <motion.img
                          src={preview}
                          alt="Cover preview"
                          className="h-32 w-48 object-cover rounded-xl border-2 border-white shadow-lg"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        />
                      ) : (
                        <Image className="text-blue-500" size={48} />
                      )}
                    </div>
                    <p className="text-gray-700 font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Blog Content */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <Type className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Blog Content</h3>
                  <p className="text-gray-600">Write your blog post content</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div ref={editorRef} className="min-h-[400px] bg-white rounded-xl border border-gray-200"></div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Blog Details */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <AlignLeft className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Blog Details</h3>
                  <p className="text-gray-600">Basic information</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Blog Title
                </label>
                <motion.input
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
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
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            variants={itemVariants}
          >
            <div className="p-6 space-y-4">
              <motion.button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <Loader color="#ffffff" />
                ) : (
                  <>
                    <Send size={20} />
                    Publish Blog
                  </>
                )}
              </motion.button>

              <motion.button
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Eye size={18} />
                Preview
              </motion.button>
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div 
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200"
            variants={itemVariants}
          >
            <h4 className="font-bold text-gray-900 mb-3">Writing Tips</h4>
            <ul className="space-y-2 text-sm text-gray-600">
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
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogEditor;