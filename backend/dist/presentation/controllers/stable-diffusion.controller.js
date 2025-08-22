"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StableDiffusionController = exports.GenerateFromResponseDto = exports.TestConnectionDto = exports.GenerateImageRequestDto = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const stable_diffusion_service_1 = require("../../infrastructure/services/stable-diffusion.service");
class GenerateImageRequestDto {
}
exports.GenerateImageRequestDto = GenerateImageRequestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateImageRequestDto.prototype, "prompt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateImageRequestDto.prototype, "negativePrompt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateImageRequestDto.prototype, "baseUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateImageRequestDto.prototype, "model", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], GenerateImageRequestDto.prototype, "steps", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], GenerateImageRequestDto.prototype, "width", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], GenerateImageRequestDto.prototype, "height", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], GenerateImageRequestDto.prototype, "cfgScale", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateImageRequestDto.prototype, "sampler", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateImageRequestDto.prototype, "sdToken", void 0);
class TestConnectionDto {
}
exports.TestConnectionDto = TestConnectionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestConnectionDto.prototype, "baseUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestConnectionDto.prototype, "sdToken", void 0);
class GenerateFromResponseDto {
}
exports.GenerateFromResponseDto = GenerateFromResponseDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateFromResponseDto.prototype, "chatResponse", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], GenerateFromResponseDto.prototype, "config", void 0);
let StableDiffusionController = class StableDiffusionController {
    constructor(stableDiffusionService) {
        this.stableDiffusionService = stableDiffusionService;
    }
    async testConnection(testDto) {
        return await this.stableDiffusionService.testConnection(testDto.baseUrl, testDto.sdToken);
    }
    async getModels(baseUrl, sdToken) {
        return await this.stableDiffusionService.getAvailableModels(baseUrl, sdToken);
    }
    async generateImage(generateDto) {
        const imageRequest = {
            prompt: generateDto.prompt,
            negativePrompt: generateDto.negativePrompt,
            config: {
                baseUrl: generateDto.baseUrl,
                model: generateDto.model,
                steps: generateDto.steps,
                width: generateDto.width,
                height: generateDto.height,
                cfgScale: generateDto.cfgScale,
                sampler: generateDto.sampler,
                token: generateDto.sdToken,
                enabled: true
            }
        };
        return await this.stableDiffusionService.generateImage(imageRequest);
    }
    async generateFromResponse(body) {
        const prompt = this.extractPromptFromChatResponse(body.chatResponse);
        const imageRequest = {
            prompt,
            negativePrompt: "low quality, blurry, distorted, text, watermark",
            config: {
                baseUrl: body.config?.baseUrl,
                model: body.config?.model,
                steps: body.config?.steps,
                width: body.config?.width,
                height: body.config?.height,
                cfgScale: body.config?.cfgScale,
                sampler: body.config?.sampler,
                enabled: true
            }
        };
        return await this.stableDiffusionService.generateImage(imageRequest);
    }
    async getSystemInfo(baseUrl) {
        return await this.stableDiffusionService.getSystemInfo(baseUrl);
    }
    async interruptGeneration(body) {
        const success = await this.stableDiffusionService.interruptGeneration(body.baseUrl);
        return { success };
    }
    async listImages() {
        const images = await this.stableDiffusionService.listSavedImages();
        return { images };
    }
    async cleanupImages(body) {
        const removedCount = await this.stableDiffusionService.cleanupOldImages(body.maxAgeHours);
        return { removedCount };
    }
    extractPromptFromChatResponse(chatResponse) {
        let prompt = chatResponse
            .replace(/```[\s\S]*?```/g, '')
            .replace(/`[^`]*`/g, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/#{1,6}\s*/g, '')
            .replace(/>\s*/g, '')
            .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
            .replace(/\n+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        if (prompt.length > 300) {
            prompt = prompt.substring(0, 300) + '...';
        }
        if (prompt.length < 10) {
            prompt = 'a beautiful, detailed illustration';
        }
        return prompt;
    }
};
exports.StableDiffusionController = StableDiffusionController;
__decorate([
    (0, common_1.Post)('test-connection'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TestConnectionDto]),
    __metadata("design:returntype", Promise)
], StableDiffusionController.prototype, "testConnection", null);
__decorate([
    (0, common_1.Get)('models'),
    __param(0, (0, common_1.Query)('baseUrl')),
    __param(1, (0, common_1.Query)('sdToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StableDiffusionController.prototype, "getModels", null);
__decorate([
    (0, common_1.Post)('generate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GenerateImageRequestDto]),
    __metadata("design:returntype", Promise)
], StableDiffusionController.prototype, "generateImage", null);
__decorate([
    (0, common_1.Post)('generate-from-response'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GenerateFromResponseDto]),
    __metadata("design:returntype", Promise)
], StableDiffusionController.prototype, "generateFromResponse", null);
__decorate([
    (0, common_1.Get)('system-info'),
    __param(0, (0, common_1.Query)('baseUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StableDiffusionController.prototype, "getSystemInfo", null);
__decorate([
    (0, common_1.Post)('interrupt'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StableDiffusionController.prototype, "interruptGeneration", null);
__decorate([
    (0, common_1.Get)('images'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StableDiffusionController.prototype, "listImages", null);
__decorate([
    (0, common_1.Post)('cleanup'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StableDiffusionController.prototype, "cleanupImages", null);
exports.StableDiffusionController = StableDiffusionController = __decorate([
    (0, common_1.Controller)('stable-diffusion'),
    __metadata("design:paramtypes", [stable_diffusion_service_1.StableDiffusionService])
], StableDiffusionController);
//# sourceMappingURL=stable-diffusion.controller.js.map