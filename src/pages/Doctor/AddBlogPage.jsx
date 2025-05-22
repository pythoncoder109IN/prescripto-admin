import { useRef, useEffect, useState, useContext } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Image, UploadCloud } from "lucide-react";
import { DoctorContext } from "../../context/doctorContext";
import { toast } from "react-toastify";
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

  const { backendUrl, dToken, isLoading, setIsLoading } =
    useContext(DoctorContext);
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
      toast.error("Unsupported file type. Please upload a PDF or image.");
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

      const formData = new FormData();
      formData.append("docId", "");
      formData.append("image", file);
      formData.append("title", title);
      formData.append("summary", summary);
      formData.append("content", editorContent);

      const { data } = await axios.post(
        backendUrl + "/api/doctor/add-blog",
        formData,
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        quillRef.current.setContents([]);

        setTitle("");
        setSummary("");
        setEditorContent("");
        setFile(null);
        setPreview(null);
      } else {
        console.log(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-primary mb-6">
        Write a Blog Post
      </h2>

      <div
        className={`max-w-[50vw] max-sm:max-w-[80vw] mx-auto my-6 border-2 border-dashed rounded-lg p-8 text-center ${
          file
            ? "border-primary bg-gray-50"
            : "border-gray-300 hover:border-primary"
        } transition-colors duration-200`}
        onClick={() => fileInputRef.current?.click()}
      >
        <label className="text-gray-700 font-semibold">
          Upload Cover Image:
        </label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {!file ? (
          <div className="cursor-pointer">
            <div className="flex justify-center mb-4">
              <UploadCloud className="text-gray-400 text-4xl" />
            </div>
            <p className="text-gray-600 mb-2">Click or drag a file to upload</p>
            <p className="text-xs text-gray-500">Supports: JPG, PNG</p>
          </div>
        ) : (
          <div>
            <div className="flex justify-center mb-4">
              {preview ? (
                <div className="relative h-48 w-48 mx-auto">
                  <img
                    src={preview}
                    alt="Prescription preview"
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
              ) : (
                <Image className="text-blue-500 text-4xl" />
              )}
            </div>
            <p className="text-gray-700 font-medium">{file.name}</p>
            <p className="text-xs text-gray-500 mt-1">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-1 mb-4">
        <p>Enter Title:</p>
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className="border border-gray-300 rounded px-3 py-2"
          type="text"
          placeholder="Title"
          required
        />
      </div>

      <div className="flex-1 flex flex-col gap-1 mb-4">
        <p>Enter Summary:</p>
        <input
          onChange={(e) => setSummary(e.target.value)}
          value={summary}
          className="border border-gray-300 rounded px-3 py-2"
          type="text"
          placeholder="Summary"
          required
        />
      </div>

      <p className="my-2">Enter Blog Content:</p>
      <div ref={editorRef} className="min-h-[300px] bg-white"></div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-primary hover:bg-blue-700 transition duration-200 text-white font-semibold rounded"
        >
          {isLoading ? <Loader color="#fff" /> : "Publish"}
        </button>
      </div>
    </div>
  );
};

export default BlogEditor;
