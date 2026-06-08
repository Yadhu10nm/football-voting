export function ShareButton() {
  const handleShare = async () => {
    const shareData = {
      title: 'World Cup 2026 Prediction Center',
      text: 'I just voted for my World Cup 2026 prediction! Join the leaderboard now.',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed', error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="rounded-3xl border border-white/10 bg-slate-900/70 px-5 py-3 text-sm font-semibold text-white transition hover:border-accent hover:bg-slate-800"
    >
      Share prediction
    </button>
  );
}
