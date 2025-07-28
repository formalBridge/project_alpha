import { IconType } from './icon';

const Logo2: IconType = ({ width, height }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={width}
      height={height}
      aria-labelledby="logoTitle"
      role="img"
    >
      <rect width="90" height="90" x="5" y="5" rx="22" ry="22" fill="transparent" stroke="#F97316" strokeWidth="3" />
      <g fill="#F97316" transform="rotate(10 50 50)">
        <rect x="42" y="18" width="15" height="52" />
        <polygon points="42,70 57,70 49.5,88" />
        <path d="M 57,18 C 85,18 95,33 80,50 C 93,46 98,30 57,22 Z" />
      </g>
    </svg>
  );
};

export default Logo2;
