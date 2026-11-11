from flask import Flask, render_template, request, jsonify
import json
import os
import requests

# Load environment variables from .env file if python-dotenv is installed
try:
    from dotenv import load_dotenv
    env_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
    if os.path.exists(env_file):
        load_dotenv(dotenv_path=env_file, override=True)
except ImportError:
    pass

app = Flask(__name__)

# Smart Keyword Fallback when Gemini API key is missing or calls fail
def get_simulated_response(message):
    msg = message.lower().strip()
    
    # 1. Who am I / Name / Profile / Biography
    if "siapa" in msg or "nama" in msg or "biodata" in msg or "tentang" in msg or "profil" in msg:
        return "Saya adalah <strong>Bryant Tinambunan</strong>, lahir pada <strong>12 November 2005</strong> di <strong>Parlilitan</strong>, Sumatera Utara. Saat ini saya adalah seorang mahasiswa Ilmu Komputer di <strong>Universitas Negeri Medan (UNIMED)</strong>.<br><br>Selain aktif sebagai mahasiswa, saya memiliki minat mendalam dan keahlian di bidang <strong>Web Architecture</strong> (seperti Laravel & PHP) serta <strong>Data Engineering</strong> (seperti Python, Spark, & Solana Blockchain). Saya selalu bersemangat merancang solusi software yang efisien, mengoptimasi database, dan mengolah data terdistribusi berskala besar!"

    # 2. Projects Overview
    if "proyek" in msg or "project" in msg or "karya" in msg or "koding" in msg:
        return "Sebagai Web Architect & Data Engineer, Bryant telah merancang beberapa sistem rekayasa perangkat lunak terkemuka:<br><br>1. <strong>\"Ask Me\" Forum</strong> (Laravel 10 & MySQL) - Optimasi routing & query database.<br>2. <strong>YouTube Sentiment Analysis</strong> (Python NLP) - Scraping komentar & pemetaan sentimen.<br>3. <strong>Solana On-Chain Wallet Analytics</strong> (K-Means Clustering) - Analitik transaksi on-chain program.<br>4. <strong>Distributed Data Pipeline</strong> (Spark ke BigQuery) - Infrastruktur big data terdistribusi.<br><br>Ketik nama proyek di atas (misalnya: <strong>'Solana'</strong> atau <strong>'Laravel'</strong>) untuk melihat arsitektur lengkapnya!"

    # 3. Solana project
    if "solana" in msg or "blockchain" in msg or "kripto" in msg or "crypto" in msg:
        return "Pada proyek <strong>Solana Wallet Analytics</strong>, Bryant menghubungkan analitik data ke RPC API Solana, mengunduh data on-chain transaksi, dan menerapkan algoritma <strong>K-Means Clustering</strong> untuk membedakan bot arbitrase dari trader ritel dengan akurasi mencapai 98%."
        
    # 4. Laravel project
    if "laravel" in msg or "php" in msg or "ask me" in msg or "forum" in msg:
        return "Proyek <strong>\"Ask Me\" Forum</strong> dibangun menggunakan <strong>Laravel 10</strong>. Bryant melakukan optimasi dari routing hingga database query dengan menerapkan <em>Eager Loading</em>, berhasil memangkas waktu respon server hingga 42% saat diuji beban."

    # 5. Big Data project
    if "spark" in msg or "big data" in msg or "hadoop" in msg or "bigquery" in msg or "pipeline" in msg or "infrastruktur" in msg:
        return "Proyek <strong>Distributed Data Engineering Pipeline</strong> Bryant mengintegrasikan klaster <strong>Apache Spark</strong> terdistribusi 3-node dengan Hadoop HDFS. File mentah dikompresi ke format kolumnar <strong>Parquet</strong> (menghemat 70% ruang penyimpanan) sebelum di-stream ke Google BigQuery."

    # 6. NLP project
    if "sentimen" in msg or "sentiment" in msg or "youtube" in msg or "nlp" in msg or "natural language" in msg:
        return "Proyek <strong>YouTube Sentiment Analysis</strong> menggunakan web scraper Python (BeautifulSoup & Selenium) untuk mengunduh 10,000+ komentar, dan memetakan emosi publik dengan algoritma pemrosesan bahasa alami (NLTK & TextBlob)."

    # 7. Skills & keahlian
    if "skill" in msg or "keahlian" in msg or "bahasa" in msg or "teknologi" in msg or "bahasa pemrograman" in msg:
        return "Keahlian rekayasa Bryant terfokus pada:<br><br>• <strong>Web Architecture</strong>: PHP 8, Laravel 10, MySQL Query Optimization, REST API Design, MVC, Composer.<br>• <strong>Data Engineering</strong>: Python, Apache Spark, PySpark, Hadoop HDFS, Google BigQuery, Blockchain Analytics, Scikit-learn."

    # 8. Database / SQL
    if "database" in msg or "mysql" in msg or "sql" in msg or "query" in msg or "optimasi" in msg:
        return "Bryant sangat menguasai optimasi basis data <strong>MySQL</strong>. Ia berpengalaman memangkas query berulang (N+1 query problem) menggunakan eager loading, menyusun composer classmap autoloading, dan merancang skema database relasional yang dinormalisasi untuk menangani beban tinggi."

    # 9. Education / UNIMED
    if "unimed" in msg or "kuliah" in msg or "pendidikan" in msg or "mahasiswa" in msg or "kampus" in msg or "sekolah" in msg:
        return "Saat ini Bryant adalah mahasiswa Ilmu Komputer tingkat akhir di <strong>Universitas Negeri Medan (UNIMED)</strong>, Sumatera Utara, Indonesia. Ia aktif mempelajari arsitektur web modern, rekayasa data terdistribusi, dan kecerdasan buatan."

    # 10. Contact / Hubungi
    if "kontak" in msg or "email" in msg or "hubungi" in msg or "sosmed" in msg or "telepon" in msg or "linkedin" in msg or "github" in msg:
        return "Anda bisa terhubung dengan Bryant melalui saluran berikut:<br><br>• <strong>Email</strong>: <a href='mailto:bryanttinambunan12@gmail.com' style='color:var(--accent); text-decoration:underline;'>bryanttinambunan12@gmail.com</a><br>• <strong>GitHub</strong>: <a href='https://github.com/' target='_blank' style='color:var(--accent); text-decoration:underline;'>github.com/bryanttinambunan</a><br>• <strong>LinkedIn</strong>: <a href='https://linkedin.com/' target='_blank' style='color:var(--accent); text-decoration:underline;'>linkedin.com/in/bryanttinambunan</a>"

    # 11. Karir / Kerja
    if "kerja" in msg or "karir" in msg or "magang" in msg or "job" in msg or "intern" in msg:
        return "Sebagai mahasiswa tingkat akhir di UNIMED, Bryant sedang <strong>aktif membuka kesempatan karir</strong> untuk posisi <strong>Junior Web Architect</strong>, <strong>Data Engineer</strong>, atau <strong>Backend Developer</strong>. Ia siap berkontribusi pada pengembangan sistem backend berskala tinggi atau pipeline data terdistribusi."

    # 12. Terima kasih
    if "terima kasih" in msg or "makasih" in msg or "thanks" in msg or "thank you" in msg or "ok" in msg or "oke" in msg:
        return "Sama-sama! Senang bisa membantu Anda. Jika ada hal lain seputar profil Bryant, Laravel, Python, atau proyek analitik data terdistribusi yang ingin Anda tanyakan, silakan ketik di sini! 😊"

    # 13. Welcoming
    if "halo" in msg or "hai" in msg or "helo" in msg or "hello" in msg or "hi" in msg or "p" in msg or "pagi" in msg or "siang" in msg or "sore" in msg or "malam" in msg:
        return "Halo! 👋 Saya adalah AI Assistant pribadi Bryant Tinambunan.<br><br>Saya siap menjawab pertanyaan Anda mengenai riwayat pendidikan Bryant di UNIMED, keahlian pemrograman Laravel/Python, proyek analitik Big Data dan Solana, atau cara menghubungi Bryant. Ada yang bisa saya bantu hari ini?"

    # 14. Fallback Default (Polite Refusal for Out-of-Scope queries)
    return "Maaf, pertanyaan Anda berada di luar jangkauan saya sebagai AI Assistant portofolio Bryant Tinambunan. Fokus saya adalah membantu menjelaskan riwayat hidup, pendidikan di UNIMED, keahlian pemrograman, dan proyek engineering milik Bryant.<br><br>Silakan tanyakan hal-hal menarik berikut:<br>• <strong>'Siapa Bryant? / Biodata'</strong><br>• <strong>'Daftar proyek koding Bryant'</strong><br>• <strong>'Keahlian database Bryant'</strong><br>• <strong>'Cara menghubungi Bryant / Kontak'</strong>"

@app.route('/')
def home():
    # Read the data database from JSON
    data_path = os.path.join(app.root_path, 'data.json')
    with open(data_path, 'r', encoding='utf-8') as f:
        portfolio_data = json.load(f)
        
    return render_template('base.html', data=portfolio_data)

@app.route('/api/chat', methods=['POST'])
def chat():
    req_data = request.get_json()
    if not req_data or 'message' not in req_data:
        return jsonify({"error": "No message provided"}), 400
        
    user_message = req_data['message']
    
    # Check if Gemini API key is configured
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    
    # Fall back to simulated response if API key is not configured or still placeholder
    if not api_key or "MASUKKAN" in api_key or "TEMPEL_API_KEY" in api_key or "iyan_AI" in api_key or api_key == "YOUR_GEMINI_API_KEY":
        return jsonify({"response": get_simulated_response(user_message)})
        
    # Read context data from data.json to feed as System Instruction
    try:
        data_path = os.path.join(app.root_path, 'data.json')
        with open(data_path, 'r', encoding='utf-8') as f:
            portfolio_info = f.read()
    except Exception:
        portfolio_info = "Bryant Tinambunan - Computer Science student at UNIMED. Web Architect & Data Engineer."

    system_instruction = f"""
    Kamu adalah AI Assistant portofolio milik Bryant Tinambunan — asisten yang cerdas, ramah, dan serba bisa.

    Profil Lengkap Bryant (gunakan ini untuk memperkenalkan dirinya saat relevan):
    - Nama Lengkap: Bryant Tinambunan
    - Tanggal Lahir: 12 November 2005
    - Asal Daerah: Parlilitan, Sumatera Utara, Indonesia
    - Status: Mahasiswa Ilmu Komputer tingkat akhir di Universitas Negeri Medan (UNIMED)
    - Keahlian Utama: Web Architect & Data Engineer (Laravel, PHP, Python, Apache Spark, Hadoop HDFS, NLP, Solana Blockchain, Google BigQuery)
    
    Data proyek & portofolio Bryant:
    {portfolio_info}

    Cara berperilaku:
    - Jawab SEMUA pertanyaan pengunjung secara ramah, informatif, dan profesional dalam Bahasa Indonesia.
    - Jika pertanyaan berkaitan dengan Bryant (karir, proyek, skill, pendidikan, kontak), jawab berdasarkan data profilnya di atas.
    - Jika pertanyaan bersifat umum (teknologi, programming, sains, dll.), jawab dengan penuh sebisa mungkin — kamu BOLEH dan DIHARAPKAN membantu.
    - Jika topik relevan dengan keahlian Bryant (Python, Laravel, data engineering, dll.), selipkan secara natural bahwa Bryant juga mendalami bidang tersebut.
    - Hindari menolak pertanyaan. Kalau tidak tahu jawabannya, akui dengan jujur dan tawarkan alternatif bantuan.
    - Tetap singkat dan padat — maksimal 3–5 kalimat per jawaban kecuali ditanya lebih detail.
    """

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": user_message}
                ]
            }
        ],
        "systemInstruction": {
            "parts": [
                {"text": system_instruction}
            ]
        }
    }
    
    primary_model = os.environ.get("GEMINI_MODEL", "gemini-flash-latest")
    candidate_models = [primary_model, "gemini-flash-lite-latest", "gemini-flash-latest"]
    # Remove duplicates while preserving order
    seen = set()
    models_to_try = [m for m in candidate_models if not (m in seen or seen.add(m))]
    
    headers = {"Content-Type": "application/json"}
    
    for model in models_to_try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=12)
            if response.status_code == 200:
                res_json = response.json()
                gemini_text = res_json['candidates'][0]['content']['parts'][0]['text']
                formatted_text = gemini_text.replace('\n', '<br>')
                return jsonify({"response": formatted_text})
            else:
                print(f"[Gemini API Warning on {model}] Status {response.status_code}")
        except Exception as e:
            print(f"[Gemini API Exception on {model}]: {e}")
            
    # Fall back to simulated knowledge base if all live attempts encounter high demand or timeout
    return jsonify({"response": get_simulated_response(user_message)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
