"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StableDiffusionModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const stable_diffusion_controller_1 = require("../controllers/stable-diffusion.controller");
const stable_diffusion_service_1 = require("../../infrastructure/services/stable-diffusion.service");
const auth_module_1 = require("./auth.module");
let StableDiffusionModule = class StableDiffusionModule {
};
exports.StableDiffusionModule = StableDiffusionModule;
exports.StableDiffusionModule = StableDiffusionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule,
            auth_module_1.AuthModule,
        ],
        controllers: [stable_diffusion_controller_1.StableDiffusionController],
        providers: [stable_diffusion_service_1.StableDiffusionService],
        exports: [stable_diffusion_service_1.StableDiffusionService],
    })
], StableDiffusionModule);
//# sourceMappingURL=stable-diffusion.module.js.map