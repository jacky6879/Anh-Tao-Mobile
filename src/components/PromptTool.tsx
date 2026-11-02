"use client";

import { useMemo, useState } from "react";

const TYPES = [
  "TVC quảng cáo",
  "Review sản phẩm",
  "Tips / hướng dẫn",
  "Bán hàng / chốt đơn",
  "Podcast / trò chuyện",
  "Giải trí / trend",
  "Giáo dục / kiến thức",
  "Khác",
];

const MODELS = [
  "Veo 3",
  "Grok Imagine",
  "Seedance 2.0",
  "Seedance 2.5",
  "Muse",
  "Model khác",
];

const ASPECTS = [
  { value: "9:16", label: "Dọc - TikTok / Reels / Shorts" },
  { value: "16:9", label: "Ngang - YouTube" },
  { value: "1:1", label: "Vuông - Feed" },
  { value: "4:5", label: "Dọc 4:5 - Feed" },
];

const DURATIONS = [15, 30, 45, 60, 90];

const TONES = [
  "Năng lượng, bán hàng",
  "Chuyên gia, đáng tin cậy",
  "Thân thiện, gần gũi",
  "Hài hước, dí dỏm",
  "Sang trọng, cao cấp",
  "Kể chuyện, cảm xúc",
  "Nhanh, dồn dập kiểu trend",
  "Podcast, trò chuyện tự nhiên",
];

const MODEL_MOVEMENT: Record<string, string> = {
  "Veo 3": "slow cinematic dolly-in, gentle pan and zoom, steady camera",
  "Grok Imagine": "smooth cinematic camera movement, slow dolly-in and pan",
  "Seedance 2.0": "natural handheld feel, slow pan across the scene, gentle zoom",
  "Seedance 2.5": "natural handheld feel, slow cinematic pan and dolly, focused on the presenter",
  Muse: "clean steady camera movement, slow zoom and pan",
  "Model khác": "slow cinematic dolly, pan and zoom, focused on the presenter",
};

function splitDuration(total: number): [number, number, number] {
  const first = Math.max(5, Math.round(total / 3));
  const second = Math.max(5, Math.round(total / 3));
  const third = Math.max(5, total - first - second);
  return [first, second, third];
}

export function PromptTool() {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState(TYPES[3]);
  const [model, setModel] = useState(MODELS[0]);
  const [aspect, setAspect] = useState("9:16");
  const [duration, setDuration] = useState(30);
  const [tone, setTone] = useState(TONES[2]);
  const [customTone, setCustomTone] = useState("");
  const [extra, setExtra] = useState("");
  const [shop, setShop] = useState("Anh Táo Mobile");
  const [address, setAddress] = useState(
    "1013 CMT8, P. Thủ Dầu Một, TP. Hồ Chí Minh"
  );
  const [copied, setCopied] = useState("");

  const toneText = customTone.trim() || tone;
  const [s1, s2, s3] = useMemo(() => splitDuration(duration), [duration]);

  const result = useMemo(() => {
    if (!topic.trim()) return null;
    const movement = MODEL_MOVEMENT[model] || MODEL_MOVEMENT["Model khác"];
    const combined = `Create a ${aspect} short video about "${topic.trim()}" for ${model}. Content type: ${type}. Tone: ${toneText}. Total duration: ${duration} seconds, in a real phone shop with natural lighting. Scene 1 (${s1}s, hook): ${movement} toward the presenter introducing the topic. Scene 2 (${s2}s, main part): slow pan across the products, then a gentle zoom on the presenter demonstrating the key points. Scene 3 (${s3}s, close): slow zoom-out to reveal the shop, ending with short on-screen text. On-screen text in Vietnamese, clear and short, maximum 2 short lines for the final frame. Voiceover in Vietnamese, ${toneText.toLowerCase()}. End with: ${shop} - ${address}.`;
    const negative =
      "distorted faces, extra fingers, garbled or misspelled on-screen text, guaranteed-approval wording, invented phone number or offer";
    const scenes = [
      {
        time: `0–${s1}s`,
        title: "Hook",
        camera: "Dolly chậm tiến vào, tập trung vào người dẫn",
        voice: `Nêu đúng nỗi lo hoặc nhu cầu của khách hàng xoay quanh: ${topic.trim()}.`,
        text: "Câu hỏi hoặc câu hook ngắn, 1 dòng",
      },
      {
        time: `${s1}–${s1 + s2}s`,
        title: "Nội dung chính",
        camera: "Pan chậm qua sản phẩm, rồi zoom nhẹ vào người dẫn đang thao tác",
        voice: `Trình bày 2-3 điểm chính của: ${topic.trim()}, nói rõ tình trạng và bảo hành, không hứa chắc kết quả chưa xác nhận.`,
        text: "Từ khóa chính, tối đa 3 cụm ngắn",
      },
      {
        time: `${s1 + s2}–${duration}s`,
        title: "Chốt",
        camera: "Zoom chậm ra, thấy rõ không gian shop",
        voice: `Nhắn tư vấn trước, phù hợp rồi hẵng qua xem máy. ${shop} - ${address}.`,
        text: `${shop} / ${address}`,
      },
    ];
    const caption = `${topic.trim()} — tư vấn rõ trước, phù hợp rồi hẵng chốt. #anhtaomobile #iphone #thucudoimoi`;
    return { combined, negative, scenes, caption };
  }, [topic, type, model, aspect, duration, toneText, shop, address, s1, s2, s3]);

  async function copy(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      setCopied("");
    }
  }

  function chip(
    label: string,
    active: boolean,
    onClick: () => void,
    key?: string
  ) {
    return (
      <button
        key={key || label}
        type="button"
        onClick={onClick}
        className={`rounded-full border px-3 py-1.5 text-sm ${
          active ? "btn btn-primary" : "btn btn-secondary"
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <section className="surface-card p-6 mb-8">
      <h2 className="text-xl font-bold mb-2">
        Công cụ tạo prompt: điền form, nhận prompt ngay
      </h2>
      <p className="text-sm text-secondary-token mb-4">
        Công cụ chạy ngay trên trình duyệt, không cần đăng nhập và không gửi
        dữ liệu của bạn đi đâu. Bạn điền form, công cụ ghép thành prompt và
        kịch bản 3 cảnh, rồi bạn copy sang Veo 3, Grok hoặc Seedance để tạo
        video. Đây là bản tạo prompt theo mẫu, không phải AI viết kịch bản tự
        do như app trong Muse.
      </p>

      <label className="block text-sm font-medium mb-1">
        Chủ đề / sản phẩm / ý tưởng *
      </label>
      <textarea
        className="input-token mb-4"
        rows={3}
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="VD: Quảng cáo iPhone 13 cũ giá tốt tại Anh Táo Mobile, thu cũ đổi mới"
      />

      <p className="text-sm font-medium mb-2">Dạng nội dung</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {TYPES.map((t) => chip(t, type === t, () => setType(t)))}
      </div>

      <p className="text-sm font-medium mb-2">Model tạo video</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {MODELS.map((m) => chip(m, model === m, () => setModel(m)))}
      </div>

      <p className="text-sm font-medium mb-2">Kích thước video</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {ASPECTS.map((a) => (
          <button
            key={a.value}
            type="button"
            onClick={() => setAspect(a.value)}
            className={`rounded-lg border p-3 text-sm ${
              aspect === a.value ? "btn btn-primary" : "btn btn-secondary"
            }`}
          >
            <span className="block font-bold">{a.value}</span>
            <span className="block text-xs">{a.label}</span>
          </button>
        ))}
      </div>

      <p className="text-sm font-medium mb-2">Thời lượng: {duration}s</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {DURATIONS.map((d) =>
          chip(`${d}s`, duration === d, () => setDuration(d))
        )}
      </div>

      <p className="text-sm font-medium mb-2">Tông giọng đọc</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {TONES.map((t) => chip(t, tone === t, () => setTone(t)))}
      </div>
      <input
        className="input-token mb-4"
        value={customTone}
        onChange={(e) => setCustomTone(e.target.value)}
        placeholder="Hoặc tự viết tông giọng riêng..."
      />

      <div className="grid md:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Tên shop ở cảnh cuối (sửa được)
          </label>
          <input
            className="input-token"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Địa chỉ ở cảnh cuối (sửa được)
          </label>
          <input
            className="input-token"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </div>

      <label className="block text-sm font-medium mb-1">Yêu cầu thêm</label>
      <input
        className="input-token mb-2"
        value={extra}
        onChange={(e) => setExtra(e.target.value)}
        placeholder="VD: nhắc địa chỉ shop ở cảnh cuối, nhấn mạnh kiểm tra máy trước khi trả tiền"
      />
      {extra.trim() ? (
        <p className="text-sm text-secondary-token mb-4">
          Yêu cầu thêm của bạn sẽ được gắn vào prompt gộp khi bạn copy:{" "}
          {extra.trim()}
        </p>
      ) : null}

      {!result ? (
        <p className="text-sm text-secondary-token">
          Nhập chủ đề ở trên để xem prompt và kịch bản 3 cảnh.
        </p>
      ) : (
        <div>
          <div className="flex items-center justify-between flex-wrap gap-2 mt-4">
            <h3 className="font-bold">Prompt gộp để dán vào {model}</h3>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                copy(
                  "combined",
                  extra.trim()
                    ? `${result.combined} Additional requirement: ${extra.trim()}`
                    : result.combined
                )
              }
            >
              {copied === "combined" ? "Đã copy" : "Copy prompt"}
            </button>
          </div>
          <p className="surface-subtle rounded-lg p-3 text-sm mt-2 whitespace-pre-wrap">
            {extra.trim()
              ? `${result.combined} Additional requirement: ${extra.trim()}`
              : result.combined}
          </p>

          <h3 className="font-bold mt-6 mb-2">Kịch bản 3 cảnh</h3>
          <div className="space-y-3">
            {result.scenes.map((s) => (
              <div key={s.title} className="surface-subtle rounded-lg p-3">
                <p className="font-semibold">
                  {s.time} - {s.title}
                </p>
                <p className="text-sm">Góc máy: {s.camera}</p>
                <p className="text-sm">Lời đọc gợi ý: {s.voice}</p>
                <p className="text-sm">Chữ trên màn hình: {s.text}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2 mt-6">
            <h3 className="font-bold">Negative prompt</h3>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => copy("negative", result.negative)}
            >
              {copied === "negative" ? "Đã copy" : "Copy"}
            </button>
          </div>
          <p className="surface-subtle rounded-lg p-3 text-sm mt-2">
            {result.negative}
          </p>

          <div className="flex items-center justify-between flex-wrap gap-2 mt-6">
            <h3 className="font-bold">Caption gợi ý</h3>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => copy("caption", result.caption)}
            >
              {copied === "caption" ? "Đã copy" : "Copy"}
            </button>
          </div>
          <p className="surface-subtle rounded-lg p-3 text-sm mt-2">
            {result.caption}
          </p>
          <p className="text-sm text-secondary-token mt-3">
            Lưu ý: kiểm tra lại mặt người dẫn, chữ trên màn hình và mọi ưu
            đãi, số điện thoại trong video trước khi đăng. Công cụ này không
            tự xác nhận ưu đãi hay số điện thoại của shop.
          </p>
        </div>
      )}
    </section>
  );
}
