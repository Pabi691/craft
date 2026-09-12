import Modal from '../ui/Modal';

export default function DistributorQuantityPopup({ open, packQty, quantities = [], selectedQuantity, onSelect, onClose, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose} title="Select quantity" subtitle={`Distributor orders go in multiples of ${packQty}.`} size="sm">
      <div className="grid grid-cols-5 gap-2">
        {quantities.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSelect(q)}
            className={`h-11 rounded-xl border text-sm font-bold transition-colors ${
              selectedQuantity === q ? 'border-ink-900 bg-ink-900 text-paper' : 'border-ink-900/10 bg-white hover:border-ink-900'
            }`}
          >
            {q}
          </button>
        ))}
      </div>
      <div className="mt-8 flex justify-end gap-3">
        <button onClick={onClose} className="btn-outline">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={!selectedQuantity} className="btn-primary">
          Add to bag
        </button>
      </div>
    </Modal>
  );
}
