export default function IconLoader ({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className={className}>
      <circle cx="25" cy="25" r="8" fill="none" stroke="#60A5FA" stroke-width="1" opacity="0">
        <animate attributeName="r" from="8" to="20" dur="2s" begin="0s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="1" to="0" dur="2s" begin="0s" repeatCount="indefinite" />
      </circle>
      <circle cx="25" cy="25" r="8" fill="none" stroke="#60A5FA" stroke-width="1" opacity="0">
        <animate attributeName="r" from="8" to="20" dur="2s" begin="0.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="1" to="0" dur="2s" begin="0.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="25" cy="25" r="8" fill="none" stroke="#60A5FA" stroke-width="1" opacity="0">
        <animate attributeName="r" from="8" to="20" dur="2s" begin="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="1" to="0" dur="2s" begin="1.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="25" cy="25" r="8" fill="#60A5FA">
        <animate attributeName="r" values="6;8;6" dur="1s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}