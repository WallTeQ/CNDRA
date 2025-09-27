import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecordById,
  fetchRecords,
} from "../../../store/slices/records/recordsThunk";
import type { RootState, AppDispatch } from "../../../store";
import { formatFileSize } from "./recordUtils";

// Components
import { LoadingState } from "./LoadingState";
import { NotFoundState } from "./NotFound";
import { NavigationAndBreadcrumb } from "./NavigationAndBreadcrumb";
import { RecordHeader } from "./RecordHeader";
import { DocumentDescription } from "./RecordDecription";
import { FileAssetsSection } from "./FileAssetsSection";
import { TagsKeywordsSection } from "./TagsKeywordsSection";
import { CitationSection } from "./CitationSection";
import { RelatedRecordsSection } from "./RelatedRecordSection";
import { DocumentMetadata } from "./RecordMetadata";
import {
  UsageRightsSection,
  HelpSection,
} from "./UsageRightsAndHelpSections";
import { ShareModal } from "./ShareModal";

export const RecordDetailsPage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    currentRecord: record,
    isLoading,
    records: allRecords,
  } = useSelector((state: RootState) => state.records);

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [relatedRecords, setRelatedRecords] = useState<any[]>([]);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchRecordById(params.id as string));
    }
  }, [dispatch, params.id]);

  useEffect(() => {
    if (record?.collection?.id) {
      // Fetch related records from the same collection
      dispatch(
        fetchRecords({ collectionId: record.collection.id, limit: 6 })
      ).then((action) => {
        if (fetchRecords.fulfilled.match(action)) {
          // Filter out the current record and limit to 3-5 related records
          const filtered = action.payload
            .filter((r: any) => r.id !== record.id)
            .slice(0, 3);
          setRelatedRecords(filtered);
        }
      });
    }
  }, [dispatch, record?.id, record?.collection?.id]);

  const handleNavigateToSearch = () => navigate("/search");
  const handleBackClick = () => navigate("/search");
  const handleShareClick = () => setIsShareOpen(true);
  const handleShareClose = () => setIsShareOpen(false);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!record) {
    return <NotFoundState onNavigateToSearch={handleNavigateToSearch} />;
  }

  // Extract data from record
  const primaryFile = record.fileAssets[0];
  const fileType = primaryFile
    ? primaryFile.mimeType.split("/")[1].toUpperCase()
    : "UNKNOWN";
  const fileSize = primaryFile ? formatFileSize(primaryFile.size) : "Unknown";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NavigationAndBreadcrumb onBackClick={handleBackClick} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <RecordHeader
              record={record}
              primaryFile={primaryFile}
              fileType={fileType}
              fileSize={fileSize}
              onShareClick={handleShareClick}
            />

            <DocumentDescription description={record.description} />

            <FileAssetsSection fileAssets={record.fileAssets} />

            <TagsKeywordsSection subjectTags={record.subjectTags} />

            <CitationSection record={record} />

            <RelatedRecordsSection relatedRecords={relatedRecords} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <DocumentMetadata
              record={record}
              primaryFile={primaryFile}
              fileType={fileType}
              fileSize={fileSize}
            />

            <UsageRightsSection />

            <HelpSection />
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={isShareOpen}
        onClose={handleShareClose}
        record={record}
      />
    </div>
  );
};