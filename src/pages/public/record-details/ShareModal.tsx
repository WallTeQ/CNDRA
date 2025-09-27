import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { formatDate, copyToClipboard } from "./recordUtils";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: any;
}

export function ShareModal({ isOpen, onClose, record }: ShareModalProps) {
  const formattedDate = formatDate(record.createdAt);
  const citationText = `"${record.title}." ${
    record.collection?.title || "Unknown Collection"
  }, ${formattedDate}. Web. ${formatDate(new Date().toISOString())}.`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Document" size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Document URL
          </label>
          <div className="flex">
            <input
              type="text"
              value={`${window.location.origin}/records/${record.id}`}
              readOnly
              className="flex-1 px-3 py-2 border border-slate-300 rounded-l-md bg-slate-50 text-sm"
            />
            <Button
              variant="outline"
              className="rounded-l-none border-l-0"
              onClick={() =>
                copyToClipboard(
                  `${window.location.origin}/records/${record.id}`
                )
              }
            >
              Copy
            </Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Citation
          </label>
          <div className="flex">
            <textarea
              value={citationText}
              readOnly
              rows={3}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-l-md bg-slate-50 text-sm resize-none"
            />
            <Button
              variant="outline"
              className="rounded-l-none border-l-0 self-start"
              onClick={() => copyToClipboard(citationText)}
            >
              Copy
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
