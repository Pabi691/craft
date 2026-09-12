import Modal from '../ui/Modal';

export default function SizeSelectionPopup({ open, sizeOptions = [], selectedVariation, onSelect, onClose, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose} title="Choose a size" subtitle="This piece comes in more than one size." size="sm">
      <div className="flex flex-wrap gap-2">
        {sizeOptions.map((v) => {
          const out = Number(v.stock_qty) === 0;
          const active = selectedVariation?.id === v.id;
          return (
            <button
              key={v.id}
              type="button"
              disabled={out}
              onClick={() => onSelect(v)}
              className={`h-12 min-w-[3.25rem] rounded-2xl border px-4 text-sm font-bold transition-all ${
                active ? 'border-ink-900 bg-ink-900 text-paper' : 'border-ink-900/10 bg-white text-ink-800 hover:border-ink-900'
              } ${out ? 'cursor-not-allowed opacity-35 line-through' : ''}`}
            >
              {v.size}
            </button>
          );
        })}
      </div>
      <div className="mt-8 flex justify-end gap-3">
        <button onClick={onClose} className="btn-outline">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={!selectedVariation} className="btn-primary">
          Continue
        </button>
      </div>
    </Modal>
  );
}
