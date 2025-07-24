//Google에서 리다이렉트된 후 authenticator.authenticate() 호출하여 세션 저장 및 리다이렉트 처리
import type { LoaderFunctionArgs } from "@remix-run/node";

import { authCallbackLoader } from "app/features/auth/loader";

export const loader = (args: LoaderFunctionArgs) => authCallbackLoader(args);

export default function AuthCallbackPage() {
    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8', textAlign: 'center', padding: '50px' }}>
        <h1>Google 인증 처리 중...</h1>
        <p>잠시만 기다려 주세요.</p>
        </div>
    );
}