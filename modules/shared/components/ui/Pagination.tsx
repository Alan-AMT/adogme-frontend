// modules/shared/components/ui/Pagination.tsx
// Idéntico visual a .cat-pagination, .cat-page-btn del CSS original
'use client'

interface PaginationProps {
  currentPage:  number
  totalPages:   number
  onPageChange: (page: number) => void
  siblingCount?: number
}

function getRange(from: number, to: number) {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i)
}

function getPages(current: number, total: number, siblings = 1): (number | '…')[] {
  if (total <= 7) return getRange(1, total)

  const left  = Math.max(2, current - siblings)
  const right = Math.min(total - 1, current + siblings)

  const showLeftDots  = left  > 2
  const showRightDots = right < total - 1

  if (!showLeftDots && showRightDots) return [...getRange(1, right), '…', total]
  if (showLeftDots && !showRightDots) return [1, '…', ...getRange(left, total)]
  return [1, '…', ...getRange(left, right), '…', total]
}

export function Pagination({ currentPage, totalPages, onPageChange, siblingCount = 1 }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPages(currentPage, totalPages, siblingCount)

  // .cat-page-btn base
  const btnBase = 'min-w-[2.4rem] h-[2.4rem] rounded-[0.65rem] border-[1.5px] font-[700] text-sm ' +
                  'flex items-center justify-center transition-all duration-150'

  return (
    <nav
      aria-label="Paginación"
      className="flex justify-center gap-1.5 py-6"
    >
      {/* Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btnBase} border-[#e4e4e7] bg-white text-[#3f3f46] hover:border-[#ff6b6b] hover:text-[#ff6b6b] disabled:opacity-40 disabled:pointer-events-none`}
        aria-label="Página anterior"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span>
      </button>

      {/* Páginas */}
      {pages.map((page, i) =>
        page === '…' ? (
          <span key={`dot-${i}`} className={`${btnBase} border-transparent text-[#a1a1aa] pointer-events-none`}>
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={[
              btnBase,
              page === currentPage
                // .cat-page-btn--active
                ? 'bg-[#ff6b6b] border-[#ff6b6b] text-white hover:bg-[#fa5252]'
                // .cat-page-btn normal
                : 'bg-white border-[#e4e4e7] text-[#3f3f46] hover:border-[#ff6b6b] hover:text-[#ff6b6b]',
            ].join(' ')}
          >
            {page}
          </button>
        )
      )}

      {/* Siguiente */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btnBase} border-[#e4e4e7] bg-white text-[#3f3f46] hover:border-[#ff6b6b] hover:text-[#ff6b6b] disabled:opacity-40 disabled:pointer-events-none`}
        aria-label="Página siguiente"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
      </button>
    </nav>
  )
}
