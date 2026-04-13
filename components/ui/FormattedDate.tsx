'use client';

import { useState, useEffect } from 'react';

interface FormattedDateProps {
  date: Date | string | null;
}

export default function FormattedDate({ date }: FormattedDateProps) {
  const [formatted, setFormatted] = useState<string>('');

  useEffect(() => {
    if (!date) {
      setFormatted('N/A');
      return;
    }

    const d = new Date(date);
    setFormatted(d.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }));
  }, [date]);

  // Return an empty span initially to avoid hydration mismatch
  return <span>{formatted}</span>;
}
