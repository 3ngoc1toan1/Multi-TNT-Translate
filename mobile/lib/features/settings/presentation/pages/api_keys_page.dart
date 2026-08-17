import 'package:flutter/material.dart';
import '../widgets/api_key_manager.dart';
import '../../core/config/api_key_config.dart';

class ApiKeysPage extends StatefulWidget {
  const ApiKeysPage({Key? key}) : super(key: key);

  @override
  State<ApiKeysPage> createState() => _ApiKeysPageState();
}

class _ApiKeysPageState extends State<ApiKeysPage> {
  late PageController _pageController;
  int _currentPage = 0;
  final Map<String, bool> _savedServices = {};

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _loadSavedServices();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _loadSavedServices() {
    // TODO: Load from storage
    _savedServices['google'] = false;
    _savedServices['deepl'] = false;
    _savedServices['openai'] = false;
    _savedServices['chatgpt'] = false;
    _savedServices['libre'] = false;
  }

  void _handleSaveKey(String service, String key) {
    setState(() {
      _savedServices[service] = true;
    });
    // TODO: Save to local storage
  }

  @override
  Widget build(BuildContext context) {
    final services = API_KEY_CONFIGS.keys.toList();

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Colors.blue.shade400,
              Colors.purple.shade600,
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '⚙️ Cấu hình API Keys',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Thêm API keys từ các dịch vụ dịch thuật để sử dụng phiên bản cao cấp. Ứng dụng sẽ tự động chuyển đổi khi hết quota.',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: Colors.white.withOpacity(0.9),
                          ),
                    ),
                  ],
                ),
              ),

              // Tabs/Dots
              Container(
                height: 60,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: services.length,
                  itemBuilder: (context, index) {
                    final service = services[index];
                    final config = API_KEY_CONFIGS[service]!;
                    final isActive = _currentPage == index;
                    final isSaved = _savedServices[service] ?? false;

                    return Padding(
                      padding: const EdgeInsets.only(right: 10),
                      child: Material(
                        child: InkWell(
                          onTap: () {
                            _pageController.animateToPage(
                              index,
                              duration: const Duration(milliseconds: 300),
                              curve: Curves.easeInOut,
                            );
                          },
                          child: Container(
                            decoration: BoxDecoration(
                              color: isActive
                                  ? Colors.white
                                  : Colors.white.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(25),
                              border: Border.all(
                                color: Colors.white.withOpacity(
                                  isActive ? 0 : 0.3,
                                ),
                              ),
                            ),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 8,
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  config.icon,
                                  style: const TextStyle(fontSize: 16),
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  config.name.split(' ').first,
                                  style: TextStyle(
                                    color: isActive
                                        ? Colors.blue.shade600
                                        : Colors.white,
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                if (isSaved)
                                  Padding(
                                    padding: const EdgeInsets.only(left: 6),
                                    child: Container(
                                      width: 16,
                                      height: 16,
                                      decoration: BoxDecoration(
                                        color: Colors.green.shade500,
                                        shape: BoxShape.circle,
                                      ),
                                      child: const Center(
                                        child: Text(
                                          '✓',
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontSize: 10,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 20),

              // Content
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  onPageChanged: (index) {
                    setState(() {
                      _currentPage = index;
                    });
                  },
                  children: services.map((service) {
                    return SingleChildScrollView(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 16,
                      ),
                      child: ApiKeyManager(
                        service: service,
                        onSave: _handleSaveKey,
                      ),
                    );
                  }).toList(),
                ),
              ),

              // Info Section at bottom
              Container(
                color: Colors.black.withOpacity(0.2),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '📌 Thông tin quan trọng',
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 12,
                      runSpacing: 8,
                      children: [
                        _InfoChip(
                          icon: '🔄',
                          label: 'Tự động chuyển đổi',
                          description: 'Khi hết quota',
                        ),
                        _InfoChip(
                          icon: '🔐',
                          label: 'Bảo mật',
                          description: 'Lưu local',
                        ),
                        _InfoChip(
                          icon: '💰',
                          label: 'Chi phí',
                          description: 'Miễn phí',
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final String icon;
  final String label;
  final String description;

  const _InfoChip({
    required this.icon,
    required this.label,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.white.withOpacity(0.3),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(icon, style: const TextStyle(fontSize: 12)),
          const SizedBox(width: 6),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              Text(
                description,
                style: TextStyle(
                  fontSize: 8,
                  color: Colors.white.withOpacity(0.8),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
