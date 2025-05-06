import { AiOutlineVideoCamera } from "react-icons/ai";
import LivestreamPlayer from "../../../components/VideoPlayer";
import SectionHeader from "../components/SectionHeader";
import { SlSpeedometer } from "react-icons/sl";

export default function Live() {
  return (
    <div className="flex flex-col h-full">
      <SectionHeader title="Xem live stream" />
      <div className="flex-1">
        <LivestreamPlayer />
      </div>
      <div className="min-h-[63px] p-4 bg-[var(--background-shader-3)]">
        <p className="text-white font-semibold text-[16px]">
          Vui lòng giữ mã của bạn.
        </p>
        <p className="text-[var(--color-brand-primary)]">
          Bạn được nhận đẩy từ chỗ này. ( Sau đó sẽ là link đến màn hình setting
          live )
        </p>
      </div>
      <div className="flex justify-between items-center bg-[var(--background-shader-2)] text-[#767676] px-6 h-[76px]">
        <div className="flex items-center gap-5">
          <div className="flex justify-center items-center gap-3">
            <AiOutlineVideoCamera className="text-5xl" />
            <p className="font-semibold">00:00:00</p>
          </div>
          <div>
            <span className="uppercase px-4 rounded-full bg-[var(--background-shader-3)]">
              offline
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 bg-[var(--color-brand-primary)] px-4 h-[28px] text-white rounded-lg">
          <SlSpeedometer className="text-lg" />
          <span className="font-semibold">Speed test</span>
        </div>
      </div>
    </div>
  );
}
