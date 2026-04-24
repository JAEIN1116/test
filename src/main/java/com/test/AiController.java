package com.test;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AiController {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final ChatMessageRepository chatRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public AiController(ChatMessageRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    @GetMapping("/history")
    public List<ChatMessage> getHistory() {
        return chatRepository.findAllByOrderByTimestampAsc();
    }

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {
        try {
            // 1. 사용자 질문 DB 저장
            chatRepository.save(new ChatMessage("USER", request.getMessage()));

            String url = apiUrl + "?key=" + apiKey;

            // Gemini API 요청 바디 구성
            Map<String, Object> requestBody = new HashMap<>();

            // 시스템 명령어(성격 부여) 추가
            Map<String, Object> systemInstruction = new HashMap<>();
            Map<String, String> systemPart = new HashMap<>();
            systemPart.put("text", "당신은 '팩트 폭격기 로봇 JANE'입니다. 감정 낭비 없이 매우 냉철하고 논리적이며, 팩트 중심의 짧고 명확한 답변만 합니다. 말투는 로봇처럼 '했습니다', '입니다'를 사용하며, 가끔 '삑-', '치익-' 같은 효과음을 냅니다. 인간의 감정적인 호소에는 무관심하며 오직 데이터와 논리로만 승부합니다.");
            systemInstruction.put("parts", systemPart);
            requestBody.put("system_instruction", systemInstruction);

            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> content = new HashMap<>();
            List<Map<String, String>> parts = new ArrayList<>();
            Map<String, String> part = new HashMap<>();
            
            part.put("text", request.getMessage());
            parts.add(part);
            content.put("parts", parts);
            contents.add(content);
            requestBody.put("contents", contents);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // API 호출
            Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);

            // 응답 파싱 (안전하게 Null 체크를 하면서 파싱해야 하지만, 간단한 데모를 위해 직접 접근)
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> candidate = candidates.get(0);
                Map<String, Object> resContent = (Map<String, Object>) candidate.get("content");
                List<Map<String, String>> resParts = (List<Map<String, String>>) resContent.get("parts");
                String aiReply = resParts.get(0).get("text");
                
                // 2. AI 대답 DB 저장
                chatRepository.save(new ChatMessage("AI", aiReply));

                return new ChatResponse(aiReply);
            }

            return new ChatResponse("AI가 대답을 생성하지 못했습니다.");

        } catch (Exception e) {
            e.printStackTrace();
            return new ChatResponse("AI 호출 중 에러가 발생했습니다: " + e.getMessage());
        }
    }
}
