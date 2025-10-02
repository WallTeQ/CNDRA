import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecord, useRecords } from "../../../hooks/useRecords";
import { formatFileSize } from "./recordUtils";
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
  
  // Fetch the current record
  const { 
    data: record, 
    isLoading, 
    isError 
  } = useRecord(params.id as string);

  // Fetch related records from the same collection
  const { data: allRecords = [] } = useRecords(
    record?.collection?.id ? { collectionId: record.collection.id } : undefined
  );

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [relatedRecords, setRelatedRecords] = useState<any[]>([]);

  useEffect(() => {
    if (record && allRecords.length > 0) {
      // Filter out the current record and limit to 3 related records
      const filtered = allRecords
        .filter((r: any) => r.id !== record.id)
        .slice(0, 3);
      setRelatedRecords(filtered);
    }
  }, [record, allRecords]);

  const handleNavigateToSearch = () => navigate("/search");
  const handleBackClick = () => navigate("/search");
  const handleShareClick = () => setIsShareOpen(true);
  const handleShareClose = () => setIsShareOpen(false);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !record) {
    return <NotFoundState onNavigateToSearch={handleNavigateToSearch} />;
  }

  // Extract data from record
  const primaryFile = record.fileAssets?.[0];
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