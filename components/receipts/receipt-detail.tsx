"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PrintableReceipt } from "./printable-receipt";
import type { Order } from "@/types";

interface ReceiptDetailProps {
  order: Order | null;
  employeeName: string;
  customerName?: string;
  onClose: () => void;
}

export function ReceiptDetail({
  order,
  employeeName,
  customerName,
  onClose,
}: ReceiptDetailProps) {
  if (!order) return null;

  return (
    <Modal open={!!order} onClose={onClose} title="Receipt" size="sm">
      <div className="p-6">
        <div id="receipt-print-area">
          <PrintableReceipt
            order={order}
            employeeName={employeeName}
            customerName={customerName}
          />
        </div>
        <div className="mt-4 flex gap-3 print:hidden">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button className="flex-1" onClick={() => window.print()}>
            Print
          </Button>
        </div>
      </div>
    </Modal>
  );
}
