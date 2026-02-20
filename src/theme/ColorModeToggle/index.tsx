import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import useIsBrowser from '@docusaurus/useIsBrowser';
import IconLightMode from '@theme/Icon/LightMode';
import IconDarkMode from '@theme/Icon/DarkMode';
import IconSystemColorMode from '@theme/Icon/SystemColorMode';
import styles from './styles.module.css';

const KOVID_STORAGE_KEY = 'kovidGoyalMode';

type ColorMode = 'light' | 'dark' | null;

function ColorModeToggle({
  className,
  buttonClassName,
  value,
  onChange,
}: {
  className?: string;
  buttonClassName?: string;
  respectPrefersColorScheme?: boolean;
  value: ColorMode;
  onChange: (value: ColorMode) => void;
}) {
  const isBrowser = useIsBrowser();
  const [open, setOpen] = useState(false);
  const [kovidMode, setKovidMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isBrowser) return;
    if (localStorage.getItem(KOVID_STORAGE_KEY) === 'true') {
      setKovidMode(true);
      document.documentElement.setAttribute('data-kovid-mode', '');
    }
  }, [isBrowser]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const toggleKovidMode = useCallback(() => {
    setKovidMode((prev) => {
      const next = !prev;
      if (next) {
        localStorage.setItem(KOVID_STORAGE_KEY, 'true');
        document.documentElement.setAttribute('data-kovid-mode', '');
      } else {
        localStorage.removeItem(KOVID_STORAGE_KEY);
        document.documentElement.removeAttribute('data-kovid-mode');
      }
      return next;
    });
  }, []);

  const themeOptions: {label: string; value: ColorMode}[] = [
    {label: 'OS Default', value: null},
    {label: 'Light', value: 'light'},
    {label: 'Dark', value: 'dark'},
  ];

  return (
    <div ref={dropdownRef} className={clsx(styles.wrapper, className)}>
      <button
        className={clsx(
          'clean-btn',
          styles.toggleButton,
          buttonClassName,
          !isBrowser && styles.toggleButtonDisabled,
        )}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={!isBrowser}
        aria-label="Theme settings"
        aria-expanded={open}>
        <IconLightMode
          aria-hidden
          className={clsx(styles.toggleIcon, styles.lightToggleIcon)}
        />
        <IconDarkMode
          aria-hidden
          className={clsx(styles.toggleIcon, styles.darkToggleIcon)}
        />
        <IconSystemColorMode
          aria-hidden
          className={clsx(styles.toggleIcon, styles.systemToggleIcon)}
        />
        <span className={styles.caret} aria-hidden>
          &#x25BE;
        </span>
      </button>
      {open && (
        <div className={styles.dropdown}>
          {themeOptions.map((opt) => (
            <button
              key={opt.label}
              className={clsx(
                styles.option,
                value === opt.value && styles.optionActive,
              )}
              onClick={() => onChange(opt.value)}>
              <span className={styles.radio}>
                {value === opt.value ? '\u25CF' : '\u25CB'}
              </span>
              {opt.label}
            </button>
          ))}
          <div className={styles.separator} />
          <div className={styles.kovidRow}>
            <button
              className={clsx(styles.option, styles.kovidOption)}
              onClick={toggleKovidMode}>
              <span className={styles.checkbox}>
                {kovidMode ? '\u2611' : '\u2610'}
              </span>
              Kovid Goyal Mode
            </button>
            <a
              href="https://github.com/kovidgoyal/kitty/issues/391#issuecomment-638320745"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.helpLink}
              title="What is this?"
              onClick={(e) => e.stopPropagation()}>
              ?
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(ColorModeToggle);
