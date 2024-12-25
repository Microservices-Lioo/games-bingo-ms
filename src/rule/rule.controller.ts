import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RuleService } from './rule.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';

@Controller()
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @MessagePattern('createRule')
  create(@Payload() createRuleDto: CreateRuleDto) {
    return this.ruleService.create(createRuleDto);
  }

  @MessagePattern('findAllRule')
  findAll() {
    return this.ruleService.findAll();
  }

  @MessagePattern('findOneRule')
  findOne(@Payload() id: number) {
    return this.ruleService.findOne(id);
  }

  @MessagePattern('updateRule')
  update(@Payload() updateRuleDto: UpdateRuleDto) {
    return this.ruleService.update(updateRuleDto);
  }

  @MessagePattern('removeRule')
  remove(@Payload() id: number) {
    return this.ruleService.remove(id);
  }
}
