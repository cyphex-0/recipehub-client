const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div
        className={`${sizes[size]} border-4 border-primary/30 border-t-primary rounded-full animate-spin`}
      ></div>
      {text && <p className="text-sm text-base-content/70 font-medium">{text}</p>}
    </div>
  )
}

export default Loader
