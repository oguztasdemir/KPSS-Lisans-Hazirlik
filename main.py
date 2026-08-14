import http.server
import socketserver
import webbrowser
import threading
import os
import sys
import time

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class QuietNoCacheHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Kod değişikliklerinin anında tarayıcıya yansıması için önbelleği devre dışı bırak
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        # 200 OK ve 304 Not Modified gibi başarılı logları gizle
        if len(args) > 1 and str(args[1]) in ['200', '304', '206', '302']:
            return
        
        # Sadece hata veya uyarı kodlarını (404, 500 vb.) terminale yazdır
        if len(args) > 1 and str(args[1]).startswith(('4', '5')):
            sys.stderr.write(f"⚠️ [HATA {args[1]}] {args[0]}\n")

    def log_error(self, format, *args):
        sys.stderr.write(f"❌ [SUNUCU HATASI] {format % args}\n")

class ThreadedHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True

def run_server(httpd):
    try:
        httpd.serve_forever()
    except Exception:
        pass

def main():
    os.chdir(DIRECTORY)
    
    server_address = ('', PORT)
    try:
        httpd = ThreadedHTTPServer(server_address, QuietNoCacheHTTPHandler)
    except OSError:
        # Eğer port 3000 meşgulse alternatif port dene
        alt_port = 3001
        httpd = ThreadedHTTPServer(('', alt_port), QuietNoCacheHTTPHandler)
        print(f"ℹ️ Port 3000 meşgul olduğu için port {alt_port} kullanılıyor.")

    server_thread = threading.Thread(target=run_server, args=(httpd,), daemon=True)
    server_thread.start()

    actual_port = httpd.server_address[1]
    url = f"http://localhost:{actual_port}"

    # Banner
    print("\n" + "=" * 62)
    print(" 🚀 KPSS Lisans GY-GK Hazırlık Uygulaması Başlatıldı!")
    print("=" * 62)
    print(f" 🌐 Yerel Sunucu URL : {url}")
    print(f" 📁 Çalışma Dizini  : {DIRECTORY}")
    print(f" 🔄 Canlı Güncelleme : Açık (Önbellek/Cache devre dışı)")
    print(f" 🔇 Log Filtresi     : Aktif (200 OK gizlendi, sadece hatalar görünür)")
    print("=" * 62)
    print(" 💡 Kapatmak için: Konsola 'exit' veya 'q' yazıp Enter'a basınız.")
    print(" ⚠️ Ctrl+C sunucuyu kapatmaz, sunucu arka planda çalışmaya devam eder.")
    print("=" * 62 + "\n")

    # Tarayıcıyı otomatik aç
    time.sleep(0.5)
    webbrowser.open(url)

    # Manuel Kapatma Döngüsü (Ctrl+C engelleme)
    while True:
        try:
            cmd = input("KPSS-App (Kapatmak için 'q' veya 'exit') > ").strip().lower()
            if cmd in ['exit', 'q', 'quit', 'kapat', 'stop']:
                print("\n🛑 Sunucu kapatılıyor... Görüşmek üzere!")
                httpd.shutdown()
                httpd.server_close()
                break
            elif cmd == 'help' or cmd == 'yardım':
                print(" Komutlar:\n  - 'q' veya 'exit' : Sunucuyu güvenle kapatır\n  - 'open'          : Tarayıcıda uygulamayı tekrar açar\n")
            elif cmd == 'open' or cmd == 'aç':
                webbrowser.open(url)
                print(f"🌐 Tarayıcı açıldı: {url}")
            elif cmd != '':
                print(f"ℹ️ Bilinmeyen komut '{cmd}'. Kapatmak için 'exit' veya 'q' yazınız.")
        except (KeyboardInterrupt, EOFError):
            print("\n[!] Ctrl+C engellendi. Sunucuyu güvenle kapatmak için konsola 'q' veya 'exit' yazıp Enter'a basınız.")

if __name__ == '__main__':
    main()
