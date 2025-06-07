declare module 'download-git-repo' {
    interface DownloadOptions {
        clone?: boolean
        [key: string]: any
    }

    function download(repo: string, dest: string, opts: DownloadOptions, callback: (err?: Error) => void): void
    function download(repo: string, dest: string, callback: (err?: Error) => void): void

    export default download
}
