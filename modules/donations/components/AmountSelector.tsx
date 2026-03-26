'use client';

import { useState, useEffect, useRef } from 'react';
import '@/modules/donations/styles/donations.css';

interface AmountSelectorProps {
  value: number;
  onChange: (monto: number) => void;
  recommended?: number;
}

const CHIP_AMOUNTS = [50, 100, 200, 500];

export default function AmountSelector({
  value,
  onChange,
  recommended,
}: AmountSelectorProps) {
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [customRaw, setCustomRaw] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // On mount: if value is not in chip amounts and is > 0, open custom mode
  useEffect(() => {
    if (value > 0 && !CHIP_AMOUNTS.includes(value)) {
      setIsCustom(true);
      setCustomRaw(String(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Focus input when custom mode is activated
  useEffect(() => {
    if (isCustom && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCustom]);

  const handleChipClick = (chip: number) => {
    setIsCustom(false);
    setCustomRaw('');
    onChange(chip);
  };

  const handleOtroClick = () => {
    setIsCustom(true);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setCustomRaw(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      onChange(parsed);
    } else {
      onChange(0);
    }
  };

  const showError = isCustom && value > 0 && value < 20;
  const showHint = isCustom && !showError;

  return (
    <div className="dn-amount-selector">
      <div className="dn-chips">
        {CHIP_AMOUNTS.map((chip) => (
          <button
            key={chip}
            type="button"
            className={`dn-chip${value === chip && !isCustom ? ' dn-chip--active' : ''}`}
            onClick={() => handleChipClick(chip)}
          >
            ${chip}
          </button>
        ))}
        <button
          type="button"
          className={`dn-chip${isCustom ? ' dn-chip--active' : ''}`}
          onClick={handleOtroClick}
        >
          Otro monto
        </button>
      </div>

      {isCustom && (
        <>
          <label className="dn-custom-label">Otro monto (MXN)</label>
          <div className="dn-custom-field">
            <span className="dn-currency-symbol">$</span>
            <input
              ref={inputRef}
              type="number"
              min={20}
              step={1}
              value={customRaw}
              onChange={handleCustomChange}
              className={`dn-custom-input${showError ? ' dn-custom-input--error' : ''}`}
              placeholder="0"
            />
          </div>
          {showError && (
            <p className="dn-error">El monto mínimo es $20</p>
          )}
          {showHint && (
            <p className="dn-min-hint">Monto mínimo: $20 MXN</p>
          )}
        </>
      )}
    </div>
  );
}
