import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { MessageEmbed } from 'discord.js';
import { send } from '@sapphire/plugin-editable-commands';
import { shuffle } from '#lib/utils';
import gameData from '#game-data/i-guess-this-is-it';
import type { Args } from '@sapphire/framework';
import type { GuildMember, Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'IGuessThisIsIt',
	aliases: ['i-guess-this-is-it', 'igtii'],
	description: 'A two-player game about saying goodbye.'
})
export class IGuessThisIsItCommand extends Command {
	// @BOTNAME IGuessThisIsIt [GAMEID] ACTION [PLAYERS] [OPTIONS]
	public override async messageRun(message: Message, args: Args) {
		this.container.logger.debug(message.content);
		// const gameId = await args.pick('number').catch(() => 0);
		const action = await args.pick('string').catch(() => 'help');
		const players = await args.repeat('member').catch(() => [message.member]);

		switch (action) {
			case 'generate': {
				return this.generate(message, players);
			}

			case 'start': {
				return this.start(message);
			}
		}

		return null;
	}

	// @BOTNAME IGuessThisIsIt generate
	// @BOTNAME IGuessThisIsIt generate @PLAYER1
	// @BOTNAME IGuessThisIsIt generate @PLAYER1 @PLAYER2 --with-setup
	public async generate(message: Message, players: (GuildMember | null)[]) {
		const relationship = shuffle(shuffle(gameData.public.relationships).shift());
		const reasonForSayingGoodbye = shuffle(gameData.public.reasonsForSayingGoodbye).shift();
		const location = shuffle(gameData.public.locations).shift();

		players = shuffle(players);
		const playerLeaving = players[0] ? players[0].displayName : 'Player 1';
		const playerStaying = players[1] ? players[1].displayName : 'Player 2';

		const embed = new MessageEmbed()
			.setColor('#d8d2cd')
			.setTitle('#@TODO GAMEID: I Guess This Is It')
			.setThumbnail('https://github.com/morbus/button-shy-games-play-bot/raw/main/docs/assets/i-guess-this-is-it--cover.png')
			.setDescription('@TODO HELP')
			.addField(`${playerLeaving} roleplays as`, `a ${relationship.shift()} saying goodbye because ${reasonForSayingGoodbye}.`, true)
			.addField(`${playerStaying} roleplays as`, `a ${relationship.shift()}.`, true)
			.addField('Location', location, true);
		return send(message, { content: `${players}`, embeds: [embed] });
	}

	public async start(message: Message) {
		return send(message, 'inside start');
	}
}
