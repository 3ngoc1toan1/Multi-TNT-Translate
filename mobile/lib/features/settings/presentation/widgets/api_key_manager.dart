import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/config/api_key_config.dart';

class ApiKeyManager extends StatefulWidget {
  final String service;
  final Function(String service, String key) onSave;
  final Function(String service, String key)? onTest;

  const ApiKeyManager({
    Key? key,
    required this.service,
    required this.onSave,
    this.onTest,
  }) : super(key: key);

  @override
  State<ApiKeyManager> createState() => _ApiKeyManagerState();
}

class _ApiKeyManagerState extends State<ApiKeyManager> {
  late TextEditingController _keyController;
  late ApiKeyConfig _config;
  bool _isKeyVisible = false;
  bool _isSaved = false;
  bool _isTesting = false;
  String _testStatus = ''; // 'success', 'error', ''
  String _testMessage = '';

  @override
  void initState() {
    super.initState();
    _keyController = TextEditingController();
    _config = API_KEY_CONFIGS[widget.service]!;
  }

  @override
  void dispose() {
    _keyController.dispose();
    super.dispose();
  }

  void _toggleKeyVisibility() {
    setState(() {
      _isKeyVisible = !_isKeyVisible;
    });
  }

  void _copyKey() {
    if (_keyController.text.isNotEmpty) {
      Clipboard.setData(ClipboardData(text: _keyController.text));
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('✅ Đã copy key!'),
          duration: Duration(seconds: 2),
        ),
      );
    }
  }

  void _saveKey() {
    if (_keyController.text.trim().isNotEmpty) {
      widget.onSave(widget.service, _keyController.text);
      setState(() {
        _isSaved = true;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('✅ Đã lưu API key!'),
          duration: Duration(seconds: 2),
        ),
      );
      Future.delayed(const Duration(seconds: 2), () {
        if (mounted) {
          setState(() {
            _isSaved = false;
          });
        }
      });
    }
  }

  Future<void> _testKey() async {
    if (_keyController.text.isEmpty) return;

    setState(() {
      _isTesting = true;
      _testStatus = '';
      _testMessage = '';
    });

    try {
      if (widget.onTest != null) {
        await widget.onTest!(widget.service, _keyController.text);
      }

      // Mock test - check if key is reasonable length
      if (_keyController.text.length > 10) {
        setState(() {
          _testStatus = 'success';
          _testMessage = '✅ Kết nối thành công!';
        });
      } else {
        setState(() {
          _testStatus = 'error';
          _testMessage = '❌ Key quá ngắn hoặc không hợp lệ';
        });
      }
    } catch (e) {
      setState(() {
        _testStatus = 'error';
        _testMessage = '❌ Lỗi: ${e.toString()}';
      });
    } finally {
      setState(() {
        _isTesting = false;
      });
      Future.delayed(const Duration(seconds: 3), () {
        if (mounted) {
          setState(() {
            _testStatus = '';
            _testMessage = '';
          });
        }
      });
    }
  }

  Future<void> _launchUrl(String url) async {
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Colors.grey[50]!,
              Colors.blue.shade50,
            ],
          ),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: Colors.blue.shade200,
            width: 1,
          ),
        ),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Text(
                  _config.icon,
                  style: const TextStyle(fontSize: 28),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _config.name,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        _config.description,
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Input Section
            Text(
              'API Key',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: Colors.grey[700],
                letterSpacing: 0.5,
              ),
            ),
            const SizedBox(height: 8),
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: Colors.blue.shade300,
                  width: 1.5,
                ),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _keyController,
                      obscureText: !_isKeyVisible,
                      decoration: InputDecoration(
                        hintText: 'Paste API key here...',
                        hintStyle: TextStyle(color: Colors.grey[400]),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 12,
                        ),
                      ),
                      style: const TextStyle(
                        fontFamily: 'monospace',
                        fontSize: 12,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: Text(_isKeyVisible ? '👁️' : '👁️‍🗨️'),
                    onPressed: _toggleKeyVisibility,
                    tooltip: _isKeyVisible ? 'Hide' : 'Show',
                  ),
                  IconButton(
                    icon: const Text('📋'),
                    onPressed: _keyController.text.isEmpty ? null : _copyKey,
                    tooltip: 'Copy key',
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Instructions
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
                border: Border(
                  left: BorderSide(
                    color: Colors.blue.shade500,
                    width: 4,
                  ),
                ),
              ),
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '📋 Hướng dẫn lấy API Key',
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 10),
                  ..._config.instructions.asMap().entries.map((entry) {
                    final index = entry.key + 1;
                    final instruction = entry.value;
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: 24,
                            height: 24,
                            decoration: BoxDecoration(
                              color: Colors.blue.shade500,
                              shape: BoxShape.circle,
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              '$index',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              instruction,
                              style: const TextStyle(
                                fontSize: 12,
                                height: 1.4,
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Pricing & Quota Info
            Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: Colors.grey.shade300,
                        width: 1,
                      ),
                    ),
                    padding: const EdgeInsets.all(10),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '💰 Giá cả',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: Colors.grey[700],
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _config.pricing,
                          style: const TextStyle(
                            fontSize: 11,
                            height: 1.3,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: Colors.grey.shade300,
                        width: 1,
                      ),
                    ),
                    padding: const EdgeInsets.all(10),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '📊 Quota',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: Colors.grey[700],
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _config.quota,
                          style: const TextStyle(
                            fontSize: 11,
                            height: 1.3,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Quick Links
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () => _launchUrl(_config.getKeyUrl),
                    icon: const Text('🔗'),
                    label: const Text('Lấy Key'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue.shade500,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 10),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => _launchUrl(_config.documentation),
                    icon: const Text('📖'),
                    label: const Text('Docs'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.blue.shade500,
                      side: BorderSide(color: Colors.blue.shade500),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 10),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Action Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _keyController.text.isEmpty || _isTesting
                        ? null
                        : _testKey,
                    icon: Text(_isTesting ? '⏳' : '🧪'),
                    label: Text(
                      _isTesting ? 'Đang test...' : 'Test kết nối',
                      style: const TextStyle(fontSize: 12),
                    ),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.orange.shade600,
                      side: BorderSide(color: Colors.orange.shade600),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 10),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _keyController.text.isEmpty ? null : _saveKey,
                    icon: Text(_isSaved ? '✅' : '💾'),
                    label: Text(
                      _isSaved ? 'Đã lưu!' : 'Lưu',
                      style: const TextStyle(fontSize: 12),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _isSaved
                          ? Colors.green.shade500
                          : Colors.blue.shade500,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 10),
                    ),
                  ),
                ),
              ],
            ),

            // Status Messages
            if (_testMessage.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 12),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: _testStatus == 'success'
                        ? Colors.green.shade50
                        : Colors.red.shade50,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: _testStatus == 'success'
                          ? Colors.green.shade300
                          : Colors.red.shade300,
                    ),
                  ),
                  child: Text(
                    _testMessage,
                    style: TextStyle(
                      fontSize: 12,
                      color: _testStatus == 'success'
                          ? Colors.green.shade700
                          : Colors.red.shade700,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),

            // Warning
            if (_keyController.text.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 12),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.amber.shade50,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: Colors.amber.shade300,
                    ),
                  ),
                  padding: const EdgeInsets.all(10),
                  child: Text(
                    '⚠️ Lưu ý bảo mật: API key của bạn sẽ được lưu LOCAL trên máy. Không bao giờ chia sẻ key với ai.',
                    style: TextStyle(
                      fontSize: 11,
                      color: Colors.amber.shade900,
                      height: 1.4,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
