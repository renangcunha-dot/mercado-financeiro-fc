export default function ClubCrest({ club, size = 48 }) {
  if (!club) return null
  const [primary, secondary] = club.colors
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 4 L92 18 V50 C92 76 74 92 50 98 C26 92 8 76 8 50 V18 Z"
        fill={primary}
        stroke={secondary}
        strokeWidth="4"
      />
      <path d="M50 4 L92 18 V50 C92 76 74 92 50 98 Z" fill={secondary} opacity="0.18" />
      <text
        x="50"
        y="60"
        textAnchor="middle"
        fontFamily="Oswald, sans-serif"
        fontWeight="600"
        fontSize="30"
        fill={secondary}
      >
        {club.short}
      </text>
    </svg>
  )
}
