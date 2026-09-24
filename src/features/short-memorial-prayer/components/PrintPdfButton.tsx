// Desktop-only: open browser print dialog (Save as PDF)

type Props = {
  onPrint: () => void
}

export function PrintPdfButton({ onPrint }: Props) {
  return (
    <button
      type="button"
      className="print-pdf-btn"
      onClick={onPrint}
      title="위령기도문을 PDF로 저장·인쇄합니다"
    >
      PDF 인쇄
    </button>
  )
}
