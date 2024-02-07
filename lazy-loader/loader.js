function initVimeo() {
  const videoWraps = document.querySelectorAll(".video-wrap[data-video-url]");
  const videoStateMap = new Map();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting && !videoStateMap.get(target)) {
        const videoUrl = target.getAttribute("data-video-url");
        const videoTitle = target.getAttribute("data-video-title");

        const iframe = document.createElement("iframe");
        iframe.src = videoUrl;
        iframe.frameBorder = "0";
        iframe.allow = "autoplay; fullscreen; picture-in-picture";
        iframe.allowfullscreen = "";

        if (videoTitle) {
          iframe.title = videoTitle;
        }

        // iframe.style = "position: absolute; inset: 0; width: 100%; height: 100%";

        iframe.style.position = "absolute";
        iframe.style.inset = "0";
        iframe.style.width = "100%";
        iframe.style.height = "100%";

        target.appendChild(iframe);

        videoStateMap.set(target, true);
      }
    });
  });

  videoWraps.forEach((videoWrap) => {
    videoStateMap.set(videoWrap, false);
    observer.observe(videoWrap);
  });
}