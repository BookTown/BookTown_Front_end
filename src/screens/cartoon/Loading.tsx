import { useState, useEffect } from "react";
import { mockMotivation } from "../../mocks/mockMotivation";

const Loading = () => {
    const [currentMotivation, setCurrentMotivation] = useState(mockMotivation[0]);

    useEffect(() => {
        // 랜덤 동기부여 문구 선택 함수
        const getRandomMotivation = () => {
            const randomIndex = Math.floor(Math.random() * mockMotivation.length);
            setCurrentMotivation(mockMotivation[randomIndex]);
        };

        // 초기 랜덤 문구 설정
        getRandomMotivation();

        // 10초마다 랜덤 문구로 변경
        const intervalId = setInterval(() => {
            getRandomMotivation();
        }, 10000);

        // 컴포넌트 언마운트 시 인터벌 정리
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-[80vh]">
            <div className="w-64 h-64 md:w-96 md:h-96">
                <img
                    src="/images/Loader.gif"
                    alt="북타운 마스코트"
                    className="w-full h-full"
                />
            </div>
            <p className="mt-4 text-2xl md:text-5xl text-center">
                고을이가 줄거리 생성중...
            </p>
            <p className="text-lg md:text-xl text-center text-[#9CAAB9] mb-6">
                <br />
                "{currentMotivation.motivation}"
                <br />
                {currentMotivation.characters}, {"<"}{currentMotivation.title}{">"}
            </p>
        </div>
    )
}

export default Loading;