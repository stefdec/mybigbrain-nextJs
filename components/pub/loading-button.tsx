import { Button } from '@components/ui/button'

export default function LoadingButton({ pending}: { pending: boolean }) {
    return (
        <Button
            type="submit"
            disabled={pending}
            className="w-full"
        >
            {pending ? (
                <div className='flex items-center justify-center'>
                    <svg
                        className="animate-spin h-5 w-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                    </svg>
                </div>
            ): (
                "Sign In"
            )}
        </Button>
    )
};