import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Edit2,
  Save,
  X,
  FileText,
  BarChart3,
  Filter,
  Upload,
  Scan,
  XCircle,
} from "lucide-react";

const useCamera = () => {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraReady(false);
  };

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Set ready immediately after stream is assigned
        setIsCameraReady(true);

        // Try to play the video
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.log("Autoplay prevented, but camera is ready:", playErr);
        }
      }
    } catch (err) {
      console.error("Camera error:", err);
      setIsCameraReady(false);
      throw err instanceof Error ? err : new Error("Failed to access camera");
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return { videoRef, isCameraReady, startCamera, stopCamera, streamRef };
};
const ScanningQCDashboard = () => {
  const [activeTab, setActiveTab] = useState("scanning");
  const [batches, setBatches] = useState([
    {
      id: "BTH-2025-001",
      dept: "Finance",
      docs: 45,
      status: "complete",
      date: "2025-10-27",
      confidence: 98,
    },
    {
      id: "BTH-2025-002",
      dept: "HR",
      docs: 32,
      status: "processing",
      date: "2025-10-27",
      confidence: 95,
    },
    {
      id: "BTH-2025-003",
      dept: "Legal",
      docs: 18,
      status: "qc-review",
      date: "2025-10-27",
      confidence: 87,
    },
  ]);

  const [qcDocuments, setQcDocuments] = useState([
    {
      id: "DOC-001",
      batch: "BTH-2025-003",
      name: "Contract_2025.pdf",
      confidence: 87,
      status: "review",
      metadata: {
        dept: "Legal",
        project: "Vendor Agreement",
        date: "2025-10-15",
      },
    },
    {
      id: "DOC-002",
      batch: "BTH-2025-003",
      name: "Invoice_4532.pdf",
      confidence: 92,
      status: "review",
      metadata: { dept: "Finance", project: "Q3 Payments", date: "2025-09-20" },
    },
    {
      id: "DOC-003",
      batch: "BTH-2025-002",
      name: "Employee_Form.pdf",
      confidence: 76,
      status: "flagged",
      metadata: { dept: "HR", project: "Onboarding", date: "2025-10-01" },
    },
  ]);

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [editingMetadata, setEditingMetadata] = useState(null);
  const [scanningActive, setScanningActive] = useState(false);
  const [currentScan, setCurrentScan] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const { videoRef, isCameraReady, startCamera, stopCamera } = useCamera();
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const startScanning = () => {
    setScanningActive(true);
    setCurrentScan({
      batchId: `BTH-2025-${String(batches.length + 1).padStart(3, "0")}`,
      docsScanned: 0,
      documents: [],
      lastBarcode: null,
      status: "scanning",
    });
  };

  const openCamera = async () => {
    try {
      setError(null);
      setCameraActive(true);
      await startCamera();
    } catch (err) {
      setCameraActive(false);
      setError(
        err.message || "Failed to access camera. Please check permissions."
      );
      console.error("Camera error:", err);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !isCameraReady) {
      setError("Camera not ready. Please try again.");
      return;
    }

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg", 0.95);

      closeCamera();
      processDocument(imageData, "camera");
    } catch (err) {
      setError("Failed to capture image. Please try again.");
      console.error("Capture error:", err);
    }
  };

  const closeCamera = () => {
    stopCamera();
    setCameraActive(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        processDocument(event.target.result, "upload");
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please select a valid image file.");
    }
  };

  const processDocument = (imageData, method) => {
    setIsProcessing(true);
    setError(null);

    setTimeout(() => {
      const barcodes = [
        { code: "FIN-2025-1234", dept: "Finance", project: "Budget Reports" },
        { code: "HR-2025-5678", dept: "HR", project: "Employee Records" },
        {
          code: "LGL-2025-9012",
          dept: "Legal",
          project: "Contract Management",
        },
      ];
      const randomBarcode =
        barcodes[Math.floor(Math.random() * barcodes.length)];
      const ocrConfidence = Math.floor(Math.random() * 25) + 75;

      const newDoc = {
        id: `DOC-${Date.now()}`,
        name: `Document_${currentScan.docsScanned + 1}_${method}.pdf`,
        barcode: randomBarcode.code,
        image: imageData,
        confidence: ocrConfidence,
        metadata: {
          dept: randomBarcode.dept,
          project: randomBarcode.project,
          date: new Date().toISOString().split("T")[0],
        },
        scanMethod: method,
        timestamp: new Date().toLocaleTimeString(),
      };

      setCurrentScan({
        ...currentScan,
        docsScanned: currentScan.docsScanned + 1,
        documents: [...currentScan.documents, newDoc],
        lastBarcode: randomBarcode.code,
      });

      setIsProcessing(false);
    }, 2000);
  };

  const removeDocument = (docId) => {
    setCurrentScan({
      ...currentScan,
      documents: currentScan.documents.filter((doc) => doc.id !== docId),
      docsScanned: currentScan.docsScanned - 1,
    });
  };

  const completeBatch = () => {
    if (!currentScan || currentScan.docsScanned === 0) {
      setError(
        "Please scan at least one document before completing the batch."
      );
      return;
    }

    const avgConfidence = Math.round(
      currentScan.documents.reduce((sum, doc) => sum + doc.confidence, 0) /
        currentScan.documents.length
    );

    const dept = currentScan.documents[0]?.metadata.dept || "Mixed";

    setBatches([
      ...batches,
      {
        id: currentScan.batchId,
        dept: dept,
        docs: currentScan.docsScanned,
        status: avgConfidence >= 90 ? "processing" : "qc-review",
        date: new Date().toISOString().split("T")[0],
        confidence: avgConfidence,
      },
    ]);

    const lowConfidenceDocs = currentScan.documents
      .filter((doc) => doc.confidence < 90)
      .map((doc) => ({
        ...doc,
        batch: currentScan.batchId,
        status: doc.confidence < 80 ? "flagged" : "review",
      }));

    if (lowConfidenceDocs.length > 0) {
      setQcDocuments([...qcDocuments, ...lowConfidenceDocs]);
    }

    setScanningActive(false);
    setCurrentScan(null);
    setError(null);
  };

  const startEditing = (doc) => {
    setEditingMetadata({ ...doc.metadata });
    setSelectedDoc(doc);
  };

  const saveMetadata = () => {
    setQcDocuments(
      qcDocuments.map((doc) =>
        doc.id === selectedDoc.id
          ? { ...doc, metadata: editingMetadata, status: "approved" }
          : doc
      )
    );
    setEditingMetadata(null);
    setSelectedDoc(null);
  };

  const flagForRescan = (docId) => {
    setQcDocuments(
      qcDocuments.map((doc) =>
        doc.id === docId ? { ...doc, status: "rescan" } : doc
      )
    );
  };

  const approveDocument = (docId) => {
    setQcDocuments(
      qcDocuments.map((doc) =>
        doc.id === docId ? { ...doc, status: "approved" } : doc
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "complete":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "qc-review":
        return "bg-yellow-100 text-yellow-800";
      case "flagged":
        return "bg-red-100 text-red-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rescan":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 95) return "text-green-600";
    if (confidence >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Document Scanning & QC System
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Barcode-based batch processing and quality control
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("scanning")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "scanning"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Scanning Operator
            </div>
          </button>
          <button
            onClick={() => setActiveTab("qc")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "qc"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Quality Control
            </div>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeTab === "scanning" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Scan Control
                </h2>

                {!scanningActive ? (
                  <button
                    onClick={startScanning}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Start New Batch
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm font-medium text-blue-900 mb-2">
                        Active Batch
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {currentScan?.batchId}
                      </div>
                      <div className="text-sm text-blue-700 mt-2">
                        Documents scanned: {currentScan?.docsScanned}
                      </div>
                      {currentScan?.lastBarcode && (
                        <div className="text-xs text-blue-600 mt-2 font-mono bg-white px-2 py-1 rounded">
                          Last: {currentScan.lastBarcode}
                        </div>
                      )}
                    </div>

                    {!cameraActive && !isProcessing && (
                      <div className="space-y-2">
                        <button
                          onClick={openCamera}
                          className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                        >
                          <Camera className="w-5 h-5" />
                          Open Camera to Scan
                        </button>

                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 flex items-center justify-center gap-2"
                        >
                          <Upload className="w-5 h-5" />
                          Upload Document
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                    )}

                    {isProcessing && (
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-3">
                          <Scan className="w-5 h-5 text-yellow-600 animate-pulse" />
                          <div>
                            <div className="text-sm font-medium text-yellow-900">
                              Processing...
                            </div>
                            <div className="text-xs text-yellow-700">
                              Reading barcode & running OCR
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={completeBatch}
                      disabled={currentScan?.docsScanned === 0}
                      className="w-full py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Complete Batch ({currentScan?.docsScanned} docs)
                    </button>
                  </div>
                )}

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Auto-Batching Rules
                  </h3>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>FIN-* → Finance Department</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>HR-* → Human Resources</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>LGL-* → Legal Department</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {cameraActive ? (
                <div className="bg-black rounded-lg shadow-sm overflow-hidden">
                  <div className="relative">
                    <div className="w-full aspect-video bg-gray-900 flex items-center justify-center">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <canvas ref={canvasRef} className="hidden" />

                    <div className="absolute top-4 left-4 right-4">
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center shadow-lg">
                        📄 Position document with barcode visible
                      </div>
                    </div>

                    {!isCameraReady && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="text-white text-center">
                          <Scan className="w-12 h-12 mx-auto mb-2 animate-pulse" />
                          <p className="text-sm">Initializing camera...</p>
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={closeCamera}
                          className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center gap-2 shadow-lg"
                        >
                          <XCircle className="w-5 h-5" />
                          Cancel
                        </button>
                        <button
                          onClick={capturePhoto}
                          disabled={!isCameraReady}
                          className="px-8 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Camera className="w-5 h-5" />
                          Capture Document
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {scanningActive
                        ? "Scanned Documents in Current Batch"
                        : "Batch History"}
                    </h2>
                  </div>

                  {scanningActive && currentScan?.documents.length > 0 ? (
                    <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                      {currentScan.documents.map((doc) => (
                        <div key={doc.id} className="p-6 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex gap-4 flex-1">
                              {doc.image && (
                                <img
                                  src={doc.image}
                                  alt="Scanned document"
                                  className="w-20 h-20 object-cover rounded border border-gray-200"
                                />
                              )}
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900">
                                  {doc.name}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  Barcode: {doc.barcode}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {doc.metadata.dept} • {doc.metadata.project}
                                </div>
                                <div className="flex items-center gap-4 mt-2">
                                  <span
                                    className={`text-sm font-medium ${getConfidenceColor(
                                      doc.confidence
                                    )}`}
                                  >
                                    OCR: {doc.confidence}%
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {doc.scanMethod} • {doc.timestamp}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeDocument(doc.id)}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : scanningActive ? (
                    <div className="p-12 text-center">
                      <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No documents scanned yet</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Use camera or upload to add documents
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {batches
                        .slice()
                        .reverse()
                        .map((batch) => (
                          <div key={batch.id} className="p-6 hover:bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gray-400" />
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {batch.id}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {batch.dept} • {batch.date}
                                  </div>
                                </div>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  batch.status
                                )}`}
                              >
                                {batch.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                              <span>{batch.docs} documents</span>
                              <span
                                className={`font-medium ${getConfidenceColor(
                                  batch.confidence
                                )}`}
                              >
                                {batch.confidence}% OCR confidence
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "qc" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    QC Review Queue
                  </h2>
                  <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                </div>
                <div className="divide-y divide-gray-200">
                  {qcDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-6 hover:bg-gray-50 cursor-pointer ${
                        selectedDoc?.id === doc.id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => setSelectedDoc(doc)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {doc.image ? (
                            <img
                              src={doc.image}
                              alt="Document"
                              className="w-16 h-16 object-cover rounded border border-gray-200"
                            />
                          ) : (
                            <FileText className="w-16 h-16 text-gray-400 p-3 border border-gray-200 rounded" />
                          )}
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">
                              {doc.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {doc.batch} • {doc.id}
                            </div>
                            {doc.barcode && (
                              <div className="text-xs text-gray-400 font-mono mt-1">
                                {doc.barcode}
                              </div>
                            )}
                            <div className="flex items-center gap-4 mt-2">
                              <div
                                className={`text-sm font-medium ${getConfidenceColor(
                                  doc.confidence
                                )}`}
                              >
                                OCR: {doc.confidence}%
                              </div>
                              {doc.confidence < 90 && (
                                <div className="flex items-center gap-1 text-xs text-amber-600">
                                  <AlertCircle className="w-3 h-3" />
                                  Below threshold
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            doc.status
                          )}`}
                        >
                          {doc.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              {selectedDoc ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Document Details
                    </h3>
                    <button
                      onClick={() => setSelectedDoc(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {selectedDoc.image && (
                    <div className="mb-4">
                      <img
                        src={selectedDoc.image}
                        alt="Document preview"
                        className="w-full h-48 object-cover rounded border border-gray-200"
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        File Name
                      </label>
                      <div className="text-sm font-medium text-gray-900">
                        {selectedDoc.name}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        OCR Confidence
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              selectedDoc.confidence >= 90
                                ? "bg-green-500"
                                : "bg-amber-500"
                            }`}
                            style={{ width: `${selectedDoc.confidence}%` }}
                          ></div>
                        </div>
                        <span
                          className={`text-sm font-semibold ${getConfidenceColor(
                            selectedDoc.confidence
                          )}`}
                        >
                          {selectedDoc.confidence}%
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-semibold text-gray-900">
                          Metadata
                        </label>
                        {!editingMetadata && (
                          <button
                            onClick={() => startEditing(selectedDoc)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Department
                          </label>
                          {editingMetadata ? (
                            <input
                              type="text"
                              value={editingMetadata.dept}
                              onChange={(e) =>
                                setEditingMetadata({
                                  ...editingMetadata,
                                  dept: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          ) : (
                            <div className="text-sm text-gray-900">
                              {selectedDoc.metadata.dept}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Project
                          </label>
                          {editingMetadata ? (
                            <input
                              type="text"
                              value={editingMetadata.project}
                              onChange={(e) =>
                                setEditingMetadata({
                                  ...editingMetadata,
                                  project: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          ) : (
                            <div className="text-sm text-gray-900">
                              {selectedDoc.metadata.project}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Date
                          </label>
                          {editingMetadata ? (
                            <input
                              type="date"
                              value={editingMetadata.date}
                              onChange={(e) =>
                                setEditingMetadata({
                                  ...editingMetadata,
                                  date: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          ) : (
                            <div className="text-sm text-gray-900">
                              {selectedDoc.metadata.date}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      {editingMetadata ? (
                        <div className="flex gap-2">
                          <button
                            onClick={saveMetadata}
                            className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingMetadata(null);
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => approveDocument(selectedDoc.id)}
                            className="w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve Document
                          </button>
                          <button
                            onClick={() => flagForRescan(selectedDoc.id)}
                            className="w-full py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 flex items-center justify-center gap-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Flag for Rescan
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">
                    Select a document to review details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default ScanningQCDashboard;