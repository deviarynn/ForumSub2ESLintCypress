# Screenshots CI/CD

Folder ini berisi screenshot sebagai bukti CI/CD dan branch protection.

## Yang harus dilampirkan:
- `1_ci_check_error.png`  → screenshot CI gagal karena test error
- `2_ci_check_pass.png`   → screenshot CI lulus semua test
- `3_branch_protection.png` → screenshot branch protection di GitHub PR

## Cara mendapatkan screenshot:
1. Push project ke GitHub
2. Buat Pull Request → GitHub Actions otomatis jalan
3. Screenshot hasil CI di tab "Actions" 
4. Aktifkan branch protection di Settings → Branches → Add rule
